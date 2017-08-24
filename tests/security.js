var lib = require("../source/index.js");

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    constantTimeCompare: {

        comparesSame: function(test) {
            test.ok(lib.security.constantTimeCompare("abc", "abc"), "Comparision should be same");
            test.done();
        },

        comparesDifferent: function(test) {
            test.ok(!lib.security.constantTimeCompare("abc", "cba"), "Comparision should be different");
            test.done();
        }

    }

};
