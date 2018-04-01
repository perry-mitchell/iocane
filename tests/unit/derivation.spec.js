const { deriveFromPassword, pbkdf2 } = require("../../source/derivation.js");

describe("derivation", function() {
    describe("deriveFromPassword", function() {
        it("derives keys", function() {
            return deriveFromPassword(pbkdf2, "pass", "aaaa", 1001).then(keyInfo => {
                expect(keyInfo).to.have.property("salt", "aaaa");
                expect(keyInfo).to.have.property("rounds", 1001);
                expect(keyInfo).to.have.property("key").that.is.an.instanceof(Buffer);
                expect(keyInfo).to.have.property("hmac").that.is.an.instanceof(Buffer);
            });
        });

        it("generates keys and HMACs with the correct size", function() {
            return deriveFromPassword(pbkdf2, "pass", "aaaa", 1001).then(keyInfo => {
                expect(keyInfo.key).to.have.lengthOf(32);
                expect(keyInfo.hmac).to.have.lengthOf(32);
            });
        });
    });
});
