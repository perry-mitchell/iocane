var lib = require("../source/index.js");

module.exports = {

    tearDown: function(done) {
        lib.components.setEncryptTool();
        lib.components.setDecryptTool();
        done();
    },

    getDecryptTool: {
        
        returnsAFunction: function(test) {
            var decryptTool = lib.components.getDecryptTool();
            test.strictEqual(typeof decryptTool, "function", "Tool should be a function");
            test.done();
        }

    },

    getEncryptTool: {

        returnsAFunction: function(test) {
            var encryptTool = lib.components.getEncryptTool();
            test.strictEqual(typeof encryptTool, "function", "Tool should be a function");
            test.done();
        }

    },

    setEncryptTool: {

        overridesBuiltInFunction: function(test) {
            var encryptTool1 = lib.components.getEncryptTool(),
                fakeFunc = function() {};
            lib.components.setEncryptTool(fakeFunc);
            var encryptTool2 = lib.components.getEncryptTool();
            test.notStrictEqual(encryptTool2, encryptTool1, "Fetched override should not match original");
            test.strictEqual(encryptTool2, fakeFunc, "Fetched override should match fake method");
            test.done();
        }

    }

};
