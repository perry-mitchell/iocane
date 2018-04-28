const { configure } = require("../../source/index.js");
const Configuration = require("../../source/Configuration.js");

describe("index", function() {
    describe("configure", function() {
        it("returns a configuration instance", function() {
            const config = configure();
            expect(config).to.be.an.instanceof(Configuration);
        });

        it("returns the same instance", function() {
            const config1 = configure();
            const config2 = configure();
            expect(config1).to.equal(config2);
        });
    });
});
