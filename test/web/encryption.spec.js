const TEXT = "Hi there!\nThis is some test text.\n\të ";

describe("encryption", function() {
    const { createSession } = window.iocane;

    describe("using AES-CBC", function() {
        it("can encrypt text", function() {
            return createSession()
                .encrypt(TEXT, "passw0rd")
                .then(output => {
                    expect(output).to.match(/^[a-zA-Z0-9=+\/]+\$/);
                });
        });

        it("can decrypt encrypted text", function() {
            return createSession()
                .encrypt(TEXT, "passw0rd")
                .then(encrypted => createSession().decrypt(encrypted, "passw0rd"))
                .then(decrypted => {
                    expect(decrypted).to.equal(TEXT);
                });
        });
    });

    describe("using AES-GCM", function() {
        it("can encrypt text", function() {
            return createSession()
                .use("gcm")
                .encrypt(TEXT, "passw0rd")
                .then(output => {
                    expect(output).to.match(/^[a-zA-Z0-9=+\/]+\$/);
                });
        });

        it("can decrypt encrypted text", function() {
            const session = createSession().use("gcm");
            return session
                .encrypt(TEXT, "passw0rd")
                .then(encrypted => session.decrypt(encrypted, "passw0rd"))
                .then(decrypted => {
                    expect(decrypted).to.equal(TEXT);
                });
        });
    });
});
