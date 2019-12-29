describe("encryption", function() {
    const { createSession } = window.iocane;

    describe("using AES-CBC", function() {
        it("can encrypt text", function() {
            return createSession()
                .encrypt("hi there", "passw0rd")
                .then(output => {
                    console.log("OUT", output);
                });
        });
    });
});
