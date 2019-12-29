describe("node output", function() {
    const { createSession } = window.iocane;
    const payload = window.nodeSample;

    describe("using CBC", function() {
        it("decrypts correctly", function() {
            const { plain, encrypted, password } = payload.cbc1;
            return createSession()
                .decrypt(encrypted, password)
                .then(result => {
                    expect(result).to.equal(plain);
                });
        });
    });

    describe("using GCM", function() {
        it("decrypts correctly", function() {
            const { plain, encrypted, password } = payload.gcm1;
            return createSession()
                .decrypt(encrypted, password)
                .then(result => {
                    expect(result).to.equal(plain);
                });
        });
    });
});
