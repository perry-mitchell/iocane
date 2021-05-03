const { EncryptionAlgorithm, createAdapter } = require("../../dist/index.node.js");

const ENCRYPTED_SAMPLE_RAW = "iocane secret text";

describe("index", function() {
    describe("createAdapter", function() {
        it("returns an adapter", function() {
            const adapter = createAdapter();
            expect(adapter)
                .to.have.property("encrypt")
                .that.is.a("function");
            expect(adapter)
                .to.have.property("decrypt")
                .that.is.a("function");
        });

        describe("returned adapter", function() {
            beforeEach(function() {
                this.adapter = createAdapter();
                this.adapter.derivationRounds = 1000;
            });

            it("can encrypt and decrypt text", async function() {
                const encrypted = await this.adapter.encrypt(ENCRYPTED_SAMPLE_RAW, "test");
                const decrypted = await this.adapter.decrypt(encrypted, "test");
                expect(decrypted).to.equal(ENCRYPTED_SAMPLE_RAW);
            });

            it("can encrypt and decrypt in CBC mode", async function() {
                this.adapter.setAlgorithm(EncryptionAlgorithm.CBC);
                const encrypted = await this.adapter.encrypt(ENCRYPTED_SAMPLE_RAW, "test");
                const decrypted = await this.adapter.decrypt(encrypted, "test");
                expect(decrypted).to.equal(ENCRYPTED_SAMPLE_RAW);
            });

            it("can encrypt and decrypt in GCM mode", async function() {
                this.adapter.setAlgorithm(EncryptionAlgorithm.GCM);
                const encrypted = await this.adapter.encrypt(ENCRYPTED_SAMPLE_RAW, "test");
                const decrypted = await this.adapter.decrypt(encrypted, "test");
                expect(decrypted).to.equal(ENCRYPTED_SAMPLE_RAW);
            });

            it("auto-detects and updates derivation rounds to match decrypted", async function() {
                this.adapter.derivationRounds = 5560;
                const encrypted = await this.adapter.encrypt(ENCRYPTED_SAMPLE_RAW, "test");
                this.adapter.derivationRounds = 1;
                await this.adapter.decrypt(encrypted, "test");
                expect(this.adapter.derivationRounds).to.equal(5560);
            });

            it("auto-detects and updates algorithm to match decrypted", async function() {
                this.adapter.algorithm = EncryptionAlgorithm.GCM;
                const encrypted = await this.adapter.encrypt(ENCRYPTED_SAMPLE_RAW, "test");
                this.adapter.algorithm = EncryptionAlgorithm.CBC;
                await this.adapter.decrypt(encrypted, "test");
                expect(this.adapter.algorithm).to.equal(EncryptionAlgorithm.GCM);
            });

            it("can encrypt and decrypt buffers in CBC mode", async function() {
                const referenceBuffer = Buffer.from("This is söme text! 北方话");
                this.adapter.setAlgorithm(EncryptionAlgorithm.CBC);
                const encrypted = await this.adapter.encrypt(referenceBuffer, "passw0rd");
                expect(encrypted).to.be.an.instanceOf(Buffer);
                const decrypted = await this.adapter.decrypt(encrypted, "passw0rd");
                expect(decrypted).to.satisfy(data => data.equals(referenceBuffer));
            });

            it("can encrypt and decrypt buffers in GCM mode", async function() {
                const referenceBuffer = Buffer.from("This is söme text! 北方话");
                this.adapter.setAlgorithm(EncryptionAlgorithm.GCM);
                const encrypted = await this.adapter.encrypt(referenceBuffer, "passw0rd");
                expect(encrypted).to.be.an.instanceOf(Buffer);
                const decrypted = await this.adapter.decrypt(encrypted, "passw0rd");
                expect(decrypted).to.satisfy(data => data.equals(referenceBuffer));
            });
        });
    });
});
