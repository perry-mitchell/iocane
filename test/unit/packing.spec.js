const {
    packEncryptedData,
    packEncryptedText,
    unpackEncryptedData,
    unpackEncryptedText
} = require("../../dist/node/packing.js");

describe("packing", function() {
    describe("packEncryptedData", function() {
        it("packs everything into a buffer", function() {
            const output = packEncryptedData({
                content: Buffer.from("abc123"),
                iv: "IV",
                salt: "SALT",
                auth: "AUTH",
                rounds: 1000,
                method: "gcm"
            });
            expect(output).to.be.an.instanceof(Buffer);
        });
    });

    describe("packEncryptedText", function() {
        it("packs everything into a string", function() {
            const output = packEncryptedText({
                content: "ENC",
                iv: "IV",
                salt: "SALT",
                auth: "AUTH",
                rounds: 1000,
                method: "gcm"
            });
            expect(output).to.equal("ENC$IV$SALT$AUTH$1000$gcm");
        });
    });

    describe("unpackEncryptedData", function() {
        beforeEach(function() {
            this.packed = packEncryptedData({
                content: Buffer.from("abc123"),
                iv: "IV",
                salt: "SALT",
                auth: "AUTH",
                rounds: 1000,
                method: "gcm"
            });
        });

        it("unpacks to correct properties", function() {
            const unpacked = unpackEncryptedData(this.packed);
            expect(unpacked)
                .to.have.property("content")
                .that.satisfies(content => content.equals(Buffer.from("abc123")));
            expect(unpacked).to.have.property("iv", "IV");
            expect(unpacked).to.have.property("salt", "SALT");
            expect(unpacked).to.have.property("auth", "AUTH");
            expect(unpacked).to.have.property("rounds", 1000);
            expect(unpacked).to.have.property("method", "gcm");
        });
    });

    describe("unpackEncryptedText", function() {
        beforeEach(function() {
            this.packed = packEncryptedText({
                content: "ENC",
                iv: "IV",
                salt: "SALT",
                auth: "AUTH",
                rounds: 1000,
                method: "gcm"
            });
        });

        it("unpacks to correct properties", function() {
            const unpacked = unpackEncryptedText(this.packed);
            expect(unpacked).to.have.property("content", "ENC");
            expect(unpacked).to.have.property("iv", "IV");
            expect(unpacked).to.have.property("salt", "SALT");
            expect(unpacked).to.have.property("auth", "AUTH");
            expect(unpacked).to.have.property("rounds", 1000);
            expect(unpacked).to.have.property("method", "gcm");
        });
    });
});
