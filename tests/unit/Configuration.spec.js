const Configuration = require("../../source/Configuration.js");

describe("Configuration", function() {
    it("instantiates without error", function() {
        expect(() => {
            new Configuration();
        }).to.not.throw();
    });

    describe("get:options", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("returns an object", function() {
            expect(this.configuration.options).to.be.an("object");
        });
    });
});
