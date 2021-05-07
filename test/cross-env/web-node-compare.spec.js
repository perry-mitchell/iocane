const path = require("path");
const Nightmare = require("nightmare");
const { EncryptionAlgorithm, createAdapter } = require("../../dist/index.node.js");

const TEXT = "Hi there!\nThis is some test text.\n\të ";

const sandboxURL = `file://${path.resolve(__dirname, "./sandbox.html")}`;

const nightmare = Nightmare({
    executionTimeout: 15000,
    loadTimeout: 5000,
    show: false
});

describe("environment consistency", function() {
    beforeEach(async function() {
        nightmare.on("console", (log, ...args) => {
            console.log(`[Web] (${log})`, ...args);
        });
        await nightmare.goto(sandboxURL);
        await nightmare.wait(1000);
        await nightmare.inject("js", path.resolve(__dirname, "../../web/index.js"));
        await nightmare.wait(1000);
    });

    after(async function() {
        await nightmare.end();
    });

    describe("from node to web", function() {
        describe("text", function() {
            it("decrypts AES-CBC from node", async function() {
                const encrypted = await createAdapter()
                    .setAlgorithm(EncryptionAlgorithm.CBC)
                    .encrypt(TEXT, "sample-pass");
                const result = await nightmare.evaluate(function(encrypted, done) {
                    const { createAdapter } = window.iocane;
                    createAdapter()
                        .decrypt(encrypted, "sample-pass")
                        .then(output => done(null, output))
                        .catch(done);
                }, encrypted);
                expect(result).to.equal(TEXT);
            });

            it("decrypts AES-GCM from node", async function() {
                const encrypted = await createAdapter()
                    .setAlgorithm(EncryptionAlgorithm.GCM)
                    .encrypt(TEXT, "sample-pass");
                const result = await nightmare.evaluate(function(encrypted, done) {
                    const { createAdapter } = window.iocane;
                    createAdapter()
                        .decrypt(encrypted, "sample-pass")
                        .then(output => done(null, output))
                        .catch(done);
                }, encrypted);
                expect(result).to.equal(TEXT);
            });
        });

        describe("data", function() {
            beforeEach(function() {
                this.randomData = [];
                for (let i = 0; i < 50000; i += 1) {
                    this.randomData.push(Math.floor(Math.random() * 256));
                }
                this.data = Buffer.from(this.randomData);
            });

            it("decrypts AES-CBC from node", async function() {
                const encrypted = await createAdapter()
                    .setAlgorithm(EncryptionAlgorithm.CBC)
                    .encrypt(this.data, "sample-pass");
                const result = await nightmare.evaluate(function(encrypted, done) {
                    const { createAdapter } = window.iocane;
                    const data = window.helpers.base64ToArrayBuffer(encrypted);
                    createAdapter()
                        .decrypt(data, "sample-pass")
                        .then(output => done(null, window.helpers.arrayBufferToBase64(output)))
                        .catch(done);
                }, encrypted.toString("base64"));
                expect(Buffer.from(result, "base64")).to.satisfy(res => res.equals(this.data));
            });

            it("decrypts AES-GCM from node", async function() {
                const encrypted = await createAdapter()
                    .setAlgorithm(EncryptionAlgorithm.GCM)
                    .encrypt(this.data, "sample-pass");
                const result = await nightmare.evaluate(function(encrypted, done) {
                    const { createAdapter } = window.iocane;
                    const data = window.helpers.base64ToArrayBuffer(encrypted);
                    createAdapter()
                        .decrypt(data, "sample-pass")
                        .then(output => done(null, window.helpers.arrayBufferToBase64(output)))
                        .catch(done);
                }, encrypted.toString("base64"));
                expect(Buffer.from(result, "base64")).to.satisfy(res => res.equals(this.data));
            });
        });
    });

    describe("from web to node", function() {
        describe("text", function() {
            it("decrypts AES-CBC from web", async function() {
                const encrypted = await nightmare.evaluate(function(raw, done) {
                    const { EncryptionAlgorithm, createAdapter } = window.iocane;
                    createAdapter()
                        .setAlgorithm(EncryptionAlgorithm.CBC)
                        .encrypt(raw, "sample-pass")
                        .then(output => done(null, output))
                        .catch(done);
                }, TEXT);
                const decrypted = await createAdapter().decrypt(encrypted, "sample-pass");
                expect(decrypted).to.equal(TEXT);
            });

            it("decrypts AES-GCM from web", async function() {
                const encrypted = await nightmare.evaluate(function(raw, done) {
                    const { EncryptionAlgorithm, createAdapter } = window.iocane;
                    createAdapter()
                        .setAlgorithm(EncryptionAlgorithm.GCM)
                        .encrypt(raw, "sample-pass")
                        .then(output => done(null, output))
                        .catch(done);
                }, TEXT);
                const decrypted = await createAdapter().decrypt(encrypted, "sample-pass");
                expect(decrypted).to.equal(TEXT);
            });
        });

        describe("data", function() {
            beforeEach(function() {
                this.randomData = [];
                for (let i = 0; i < 50000; i += 1) {
                    this.randomData.push(Math.floor(Math.random() * 256));
                }
                this.data = Buffer.from(this.randomData);
            });

            it("decrypts AES-CBC from web", async function() {
                const encrypted = await nightmare.evaluate(function(raw, done) {
                    const { EncryptionAlgorithm, createAdapter } = window.iocane;
                    const data = window.helpers.base64ToArrayBuffer(raw);
                    createAdapter()
                        .setAlgorithm(EncryptionAlgorithm.CBC)
                        .encrypt(data, "sample-pass")
                        .then(output => done(null, window.helpers.arrayBufferToBase64(output)))
                        .catch(done);
                }, this.data.toString("base64"));
                const decrypted = await createAdapter().decrypt(
                    Buffer.from(encrypted, "base64"),
                    "sample-pass"
                );
                expect(decrypted).to.satisfy(res => res.equals(this.data));
            });

            it("decrypts AES-GCM from web", async function() {
                const encrypted = await nightmare.evaluate(function(raw, done) {
                    const { EncryptionAlgorithm, createAdapter } = window.iocane;
                    const data = window.helpers.base64ToArrayBuffer(raw);
                    createAdapter()
                        .setAlgorithm(EncryptionAlgorithm.GCM)
                        .encrypt(data, "sample-pass")
                        .then(output => done(null, window.helpers.arrayBufferToBase64(output)))
                        .catch(done);
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
