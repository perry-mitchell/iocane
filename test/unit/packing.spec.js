const { packEncryptedText, unpackEncryptedText } = require("../../dist/base/packing.js");

describe("packing", function() {
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
