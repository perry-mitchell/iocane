var lib = require("../source/index.js");

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    encryptWithPassword: {

        testEncryptsCorrectly: function(test) {
            var text = "some random text";
            lib.crypto.encryptWithPassword(text, "passw0rd")
                .then(function(encrypted) {
                    test.notStrictEqual(encrypted, text, "Encrypted text should not match original");
                    test.ok(encrypted.length > text.length, "Encrypted text should be longer");
                    test.done();
                })
                .catch(function(err) {
                    console.error(err);
                });
        }

    },

    decryptWithPassword: {

        testDecryptsCorrectly: function(test) {
            var encrypted = "2gm1Wfq1fth7MnAjcB4SYxnTfLPqi8eUOzxZP60WjaU=$4803449218c7770f91ee8b55ed02ec5e$a8d22a199b3b$66503041903ff3368f6373e167cc6e2c9efed4596d72accc15ed5b84aabfed9e$7490";
            lib.crypto.decryptWithPassword(encrypted, "passw0rd")
                .then(function(decrypted) {
                    test.strictEqual(decrypted, "some random text", "Decrypted text should be correct");
                    test.done();
                })
                .catch(function(err) {
                    console.error(err);
                });
        }

    }

};
