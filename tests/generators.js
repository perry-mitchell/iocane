var lib = require("../source/index.js");

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    generateIV: {

        testGeneratesCorrectLength: function(test) {
            test.strictEqual(lib.generators.generateIV().length, 16, "IV should be correct size");
            test.done();
        }

    },

    generateSalt: {

        testGeneratesDifferentLengths: function(test) {
            var salt10 = lib.generators.generateSalt(10),
                salt35 = lib.generators.generateSalt(35);
            test.strictEqual(salt10.length, 10, "Salt should be correct length (10)");
            test.strictEqual(salt35.length, 35, "Salt should be correct length (35)");
            test.done();
        }

    }

};
