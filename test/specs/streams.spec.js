const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { PassThrough } = require("stream");
const streamToArray = require("stream-to-array");
const randomBytesReadableStream = require("random-bytes-readable-stream");
const endOfStream = require("end-of-stream-promise");
const hashThrough = require("hash-through");
const devNull = require("dev-null");
const { EncryptionAlgorithm, createAdapter } = require("../../dist/index.node.js");

const TEST_FILE = path.resolve(__dirname, "../../test.dat");
const TEST_FILE_SIZE = 256 * 1024 * 1024; // 256MB

function createHash() {
    return crypto.createHash("sha1");
}

describe("index", function() {
    describe("createAdapter", function() {
        describe("returned adapter", function() {
            beforeEach(function() {
                this.adapter = createAdapter();
                this.adapter.derivationRounds = 1000;
            });

            describe("using streams", function() {
                [EncryptionAlgorithm.CBC, EncryptionAlgorithm.GCM].forEach(encAlgo => {
                    describe(`using ${encAlgo.toUpperCase()}`, function() {
                        beforeEach(function() {
                            this.adapter.setAlgorithm(encAlgo);
                        });

                        it("can encrypt with streams and decrypt as a buffer", async function() {
                            const referenceBuffer = Buffer.from("This is söme text! 北方话");
                            const input = new PassThrough();
                            input.write(referenceBuffer);
                            input.end();
                            const arrays = await streamToArray(
                                input.pipe(this.adapter.createEncryptStream("test"))
                            );
                            const encrypted = Buffer.concat(arrays);
                            const decrypted = await this.adapter.decrypt(encrypted, "test");
                            expect(decrypted).to.satisfy(data => data.equals(referenceBuffer));
                        });

                        it("can encrypt as a buffer and decrypt with streams", async function() {
                            const referenceBuffer = Buffer.from("This is söme text! 北方话");
                            const encrypted = await this.adapter.encrypt(referenceBuffer, "test");
                            const output = new PassThrough();
                            const finalStream = output.pipe(
                                this.adapter.createDecryptStream("test")
                            );
                            output.write(encrypted);
                            output.end();
                            const arrays = await streamToArray(finalStream);
                            const decrypted = Buffer.concat(arrays);
                            expect(decrypted).to.satisfy(data => data.equals(referenceBuffer));
                        });

                        it("can encrypt and decrypt large streams", async function() {
                            // Write to disk
                            const writeHash = hashThrough(createHash);
                            const writePipe = randomBytesReadableStream({ size: TEST_FILE_SIZE })
                                .pipe(writeHash)
                                .pipe(this.adapter.createEncryptStream("passw0rd"))
                                .pipe(fs.createWriteStream(TEST_FILE));
                            await endOfStream(writePipe);
                            const writtenHash = writeHash.digest("hex");
                            // Read and decrypt
                            const readHash = hashThrough(createHash);
                            const readPipe = fs
                                .createReadStream(TEST_FILE)
                                .pipe(this.adapter.createDecryptStream("passw0rd"))
                                .pipe(readHash)
                                .pipe(devNull());
                            readPipe.on("error", console.error);
                            await endOfStream(readPipe);
                            const retrievedHash = readHash.digest("hex");
                            // Check hashes
                            expect(retrievedHash).to.equal(writtenHash);
                        });
                    });
                });
            });
        });
    });
});
