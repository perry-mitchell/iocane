const path = require("path");
const puppeteer = require("puppeteer");
const { EncryptionAlgorithm, createAdapter } = require("../../dist/index.node.js");

const TEXT = "Hi there!\nThis is some test text.\n\të ";

const sandboxURL = `file://${path.resolve(__dirname, "./sandbox.html")}`;

async function sleep(ms) {
    await new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    });
}

describe("environment consistency", function () {
    before(async function () {
        this.browser = await puppeteer.launch({
            headless: "new"
        });
    });

    after(async function () {
        await this.browser.close();
    });

    beforeEach(async function () {
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1024, height: 768 });
        await this.page.goto(sandboxURL);
        await this.page.waitForNetworkIdle();
        await sleep(500);
        await this.page.addScriptTag({
            path: path.resolve(__dirname, "../../web/index.js")
        });
        await sleep(500);
    });

    afterEach(async function () {
        await this.page.close();
    });

    describe("from node to web", function () {
        describe("text", function () {
            it("decrypts AES-CBC from node", async function () {
                const encrypted = await createAdapter()
                    .setAlgorithm(EncryptionAlgorithm.CBC)
                    .encrypt(TEXT, "sample-pass");
                const result = await this.page.evaluate(async function (encrypted) {
                    const { createAdapter } = window.iocane;
                    return createAdapter().decrypt(encrypted, "sample-pass");
                }, encrypted);
                expect(result).to.equal(TEXT);
            });

            it("decrypts AES-GCM from node", async function () {
                const encrypted = await createAdapter()
                    .setAlgorithm(EncryptionAlgorithm.GCM)
                    .encrypt(TEXT, "sample-pass");
                const result = await this.page.evaluate(async function (encrypted) {
                    const { createAdapter } = window.iocane;
                    return createAdapter().decrypt(encrypted, "sample-pass");
                }, encrypted);
                expect(result).to.equal(TEXT);
            });
        });

        describe("data", function () {
            beforeEach(function () {
                this.randomData = [];
                for (let i = 0; i < 50000; i += 1) {
                    this.randomData.push(Math.floor(Math.random() * 256));
                }
                this.data = Buffer.from(this.randomData);
            });

            it("decrypts AES-CBC from node", async function () {
                const encrypted = await createAdapter()
                    .setAlgorithm(EncryptionAlgorithm.CBC)
                    .encrypt(this.data, "sample-pass");
                const result = await this.page.evaluate(async function (encrypted) {
                    const { createAdapter } = window.iocane;
                    const data = window.helpers.base64ToArrayBuffer(encrypted);
                    const output = await createAdapter().decrypt(data, "sample-pass");
                    return window.helpers.arrayBufferToBase64(output);
                }, encrypted.toString("base64"));
                expect(Buffer.from(result, "base64")).to.satisfy(res => res.equals(this.data));
            });

            it("decrypts AES-GCM from node", async function () {
                const encrypted = await createAdapter()
                    .setAlgorithm(EncryptionAlgorithm.GCM)
                    .encrypt(this.data, "sample-pass");
                const result = await this.page.evaluate(async function (encrypted) {
                    const { createAdapter } = window.iocane;
                    const data = window.helpers.base64ToArrayBuffer(encrypted);
                    const output = await createAdapter().decrypt(data, "sample-pass");
                    return window.helpers.arrayBufferToBase64(output);
                }, encrypted.toString("base64"));
                expect(Buffer.from(result, "base64")).to.satisfy(res => res.equals(this.data));
            });
        });
    });

    describe("from web to node", function () {
        describe("text", function () {
            it("decrypts AES-CBC from web", async function () {
                const encrypted = await this.page.evaluate(async function (raw) {
                    const { EncryptionAlgorithm, createAdapter } = window.iocane;
                    return createAdapter()
                        .setAlgorithm(EncryptionAlgorithm.CBC)
                        .encrypt(raw, "sample-pass");
                }, TEXT);
                const decrypted = await createAdapter().decrypt(encrypted, "sample-pass");
                expect(decrypted).to.equal(TEXT);
            });

            it("decrypts AES-GCM from web", async function () {
                const encrypted = await this.page.evaluate(async function (raw) {
                    const { EncryptionAlgorithm, createAdapter } = window.iocane;
                    return createAdapter()
                        .setAlgorithm(EncryptionAlgorithm.GCM)
                        .encrypt(raw, "sample-pass");
                }, TEXT);
                const decrypted = await createAdapter().decrypt(encrypted, "sample-pass");
                expect(decrypted).to.equal(TEXT);
            });
        });

        describe("data", function () {
            beforeEach(function () {
                this.randomData = [];
                for (let i = 0; i < 50000; i += 1) {
                    this.randomData.push(Math.floor(Math.random() * 256));
                }
                this.data = Buffer.from(this.randomData);
            });

            it("decrypts AES-CBC from web", async function () {
                const encrypted = await this.page.evaluate(async function (raw) {
                    const { EncryptionAlgorithm, createAdapter } = window.iocane;
                    const data = window.helpers.base64ToArrayBuffer(raw);
                    const output = await createAdapter()
                        .setAlgorithm(EncryptionAlgorithm.CBC)
                        .encrypt(data, "sample-pass");
                    return window.helpers.arrayBufferToBase64(output);
                }, this.data.toString("base64"));
                const decrypted = await createAdapter().decrypt(
                    Buffer.from(encrypted, "base64"),
                    "sample-pass"
                );
                expect(decrypted).to.satisfy(res => res.equals(this.data));
            });

            it("decrypts AES-GCM from web", async function () {
                const encrypted = await this.page.evaluate(async function (raw) {
                    const { EncryptionAlgorithm, createAdapter } = window.iocane;
                    const data = window.helpers.base64ToArrayBuffer(raw);
                    const output = await createAdapter()
                        .setAlgorithm(EncryptionAlgorithm.GCM)
                        .encrypt(data, "sample-pass");
                    return window.helpers.arrayBufferToBase64(output);
                }, this.data.toString("base64"));
                const decrypted = await createAdapter().decrypt(
                    Buffer.from(encrypted, "base64"),
                    "sample-pass"
                );
                expect(decrypted).to.satisfy(res => res.equals(this.data));
            });
        });
    });
});
