const { createSession } = require("../../dist/index.js");
const Session = require("../../dist/Session.js");

describe("index", function() {
    describe("createSession", function() {
        it("returns a Session instance", function() {
            const session = createSession();
            expect(session).to.be.an.instanceof(Session);
        });

        it("returns a different instance", function() {
            const session1 = createSession();
            const session2 = createSession();
            expect(session1).not.to.equal(session2);
        });
    });
});
