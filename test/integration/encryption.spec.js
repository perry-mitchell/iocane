const { createSession } = require("../../dist/index.node.js");

const TEXT = "Hi there!\nThis is some test text.\n\të ";

describe("encryption", function() {
    describe("of text", function() {
        it("can encrypt and decrypt in CBC mode", function() {
            return createSession()
                .use("cbc")
                .setDerivationRounds(1000)
                .encrypt(TEXT, "passw0rd")
                .then(encrypted => {
                    return createSession().decrypt(encrypted, "passw0rd");
                })
                .then(decrypted => {
                    expect(decrypted).to.equal(TEXT);
                });
        });

        it("can encrypt and decrypt in GCM mode", function() {
            return createSession()
                .use("gcm")
                .setDerivationRounds(1000)
                .encrypt(TEXT, "passw0rd")
                .then(encrypted => {
                    return createSession().decrypt(encrypted, "passw0rd");
                })
                .then(decrypted => {
                    expect(decrypted).to.equal(TEXT);
                });
        });

        it("can encrypt and decrypt large amounts of text in CBC", function() {
            const txt = "Sample text. ".repeat(5000000);
            return createSession()
                .use("cbc")
                .setDerivationRounds(1000)
                .encrypt(txt, "passw0rd")
                .then(encrypted => {
                    return createSession().decrypt(encrypted, "passw0rd");
                })
                .then(decrypted => {
                    expect(decrypted).to.equal(txt);
                });
        });

        it("can encrypt and decrypt large amounts of text in CBC", function() {
            const txt = "Sample text. ".repeat(5000000);
            return createSession()
                .use("gcm")
                .setDerivationRounds(1000)
                .encrypt(txt, "passw0rd")
                .then(encrypted => {
                    return createSession().decrypt(encrypted, "passw0rd");
                })
                .then(decrypted => {
                    expect(decrypted).to.equal(txt);
                });
        });
    });

    describe("of data", function() {
        it("can encrypt and decrypt in CBC mode", function() {
            const referenceBuffer = Buffer.from("This is söme text! 北方话");
            return createSession()
                .use("cbc")
                .setDerivationRounds(1000)
                .encrypt(referenceBuffer, "passw0rd")
                .then(encrypted => {
                    expect(encrypted).to.be.an.instanceOf(Buffer);
                    return createSession().decrypt(encrypted, "passw0rd");
                })
                .then(decrypted => {
                    expect(decrypted).to.satisfy(data => data.equals(referenceBuffer));
                });
        });

        it("can encrypt and decrypt in GCM mode", function() {
            const referenceBuffer = Buffer.from("This is söme text! 北方话");
            return createSession()
                .use("gcm")
                .setDerivationRounds(1000)
                .encrypt(referenceBuffer, "passw0rd")
                .then(encrypted => {
                    expect(encrypted).to.be.an.instanceOf(Buffer);
                    return createSession().decrypt(encrypted, "passw0rd");
                })
                .then(decrypted => {
                    expect(decrypted).to.satisfy(data => data.equals(referenceBuffer));
                });
        });
    });
});
