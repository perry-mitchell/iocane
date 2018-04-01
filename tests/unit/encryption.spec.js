const { decryptCBC, decryptGCM, encryptCBC, encryptGCM } = require("../../source/encryption.js");
const { deriveFromPassword, pbkdf2 } = require("../../source/derivation.js");

const ENCRYPTED_SAMPLE = "at5427PQdplGgZgcmIjy/Fv0xZaiKO+bzmY7NsnYj90=";
const ENCRYPTED_SAMPLE_RAW = "iocane secret text";

describe("encryption", function() {
    describe("decryptCBC", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return encryptCBC(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo);
                })
                .then(encryptedComponents => {
                    this.encryptedComponents = encryptedComponents;
                });
        });

        it("decrypts encrypted components", function() {
            return decryptCBC(this.encryptedComponents, this.keyDerivationInfo).then(raw => {
                expect(raw).to.equal(ENCRYPTED_SAMPLE_RAW);
            });
        });
    });

    describe("decryptGCM", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return encryptGCM(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo);
                })
                .then(encryptedComponents => {
                    this.encryptedComponents = encryptedComponents;
                });
        });

        it("decrypts encrypted components", function() {
            return decryptGCM(this.encryptedComponents, this.keyDerivationInfo).then(raw => {
                expect(raw).to.equal(ENCRYPTED_SAMPLE_RAW);
            });
        });
    });

    describe("encryptCBC", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000).then(keyDerivationInfo => {
                this.keyDerivationInfo = keyDerivationInfo;
            });
        });

        it("encrypts text", function() {
            return encryptCBC(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo).then(encrypted => {
                expect(encrypted).to.have.property("content").that.is.a("string");
                expect(encrypted.content).to.not.contain(ENCRYPTED_SAMPLE_RAW);
            });
        });

        it("outputs expected components", function() {
            return encryptCBC(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo).then(encrypted => {
                expect(encrypted).to.have.property("hmac").that.matches(/^[a-f0-9]{64}$/);
                expect(encrypted).to.have.property("rounds", 1000);
                expect(encrypted).to.have.property("iv").that.matches(/^[a-f0-9]+$/);
                expect(encrypted).to.have.property("salt", "salt");
                expect(encrypted).to.have.property("mode", "cbc");
            });
        });
    });

    describe("encryptGCM", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000).then(keyDerivationInfo => {
                this.keyDerivationInfo = keyDerivationInfo;
            });
        });

        it("encrypts text", function() {
            return encryptGCM(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo).then(encrypted => {
                expect(encrypted).to.have.property("content").that.is.a("string");
                expect(encrypted.content).to.not.contain(ENCRYPTED_SAMPLE_RAW);
            });
        });

        it("outputs expected components", function() {
            return encryptGCM(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo).then(encrypted => {
                expect(encrypted).to.have.property("tag").that.matches(/^[a-f0-9]+$/);
                expect(encrypted).to.have.property("rounds", 1000);
                expect(encrypted).to.have.property("iv").that.matches(/^[a-f0-9]+$/);
                expect(encrypted).to.have.property("salt", "salt");
                expect(encrypted).to.have.property("mode", "gcm");
            });
        });
    });
});
