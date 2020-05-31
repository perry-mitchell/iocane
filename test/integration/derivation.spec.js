const crypto = require("crypto");
const { createSession } = require("../../dist/index.node.js");

describe("derivation", function() {
    beforeEach(function() {
        this.pbkdf2 = sinon.stub().callsFake((password, salt, rounds, bits) => {
            const bytes = bits / 8;
            return new Promise(resolve => {
                crypto.randomBytes(bytes, (err, buff) => {
                    resolve(buff);
                });
            });
        });
    });

    it("supports overriding the PBKDF2 implementation", function() {
        return createSession()
            .overridePBKDF2(this.pbkdf2)
            .setDerivationRounds(10)
            .encrypt("test", "pass")
            .then(enc => {
                expect(this.pbkdf2.callCount).to.equal(1);
                const [pass, salt, rounds, bits] = this.pbkdf2.firstCall.args;
                expect(pass).to.equal("pass");
                expect(rounds).to.equal(10);
                expect(bits).to.equal(64 * 8);
            });
    });
});
