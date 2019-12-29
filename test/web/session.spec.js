describe("Session", function() {
    const { createSession } = window.iocane;

    it("can be created", function() {
        const session = createSession();
        expect(session).to.be.an("object");
    });
});
