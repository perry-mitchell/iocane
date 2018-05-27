var lib = require("../source/index.js");

var path = require("path"),
    fs = require("fs");

var filename = path.resolve(__dirname, "./resources/gradient.png");

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    encryptWithKeyFile: {

        encryptsCorrectly: function(test) {
            var text = "some random text";
            lib.crypto.encryptWithKeyFile(text, filename)
                .then(function(encrypted) {
                    test.notStrictEqual(encrypted, text, "Encrypted text should not match original");
                    test.ok(encrypted.length > text.length, "Encrypted text should be longer");
                    test.done();
                })
                .catch(function(err) {
                    console.error(err);
                });
        },

        encryptsUsingData: function(test) {
            fs.readFile(filename, function(err, data) {
                var text = "some random text";
                lib.crypto.encryptWithKeyFile(text, filename)
                    .then(function(encrypted) {
                        test.notStrictEqual(encrypted, text, "Encrypted text should not match original");
                        test.ok(encrypted.length > text.length, "Encrypted text should be longer");
                        test.done();
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
            });
        }

    },

    encryptWithPassword: {

        encryptsCorrectly: function(test) {
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

    decryptWithKeyFile: {

        decryptsCorrectly: function(test) {
            var encrypted = "0l/Km7YgysyJXowifP8nWOe6FYONVZGe6IgnXePxH6M=$3c0a55b7b203e5fa1bf7f2b97e08ac1a$ffea2754e571$812f89a31afd72921ca01a245975d3a283b05d9883583487b859cb59f00adbbc$6709";
            lib.crypto.decryptWithKeyFile(encrypted, filename)
                .then(function(decrypted) {
                    test.strictEqual(decrypted, "some random text", "Decrypted text should be correct");
                    test.done();
                })
                .catch(function(err) {
                    console.error(err);
                });
        }

    },

    decryptWithPassword: {

        decryptsCorrectly: function(test) {
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