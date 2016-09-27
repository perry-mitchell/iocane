var lib = require("../../source/index.js");

var path = require("path"),
    fs = require("fs");

var filename = path.resolve(__dirname, "../resources/gradient.png");

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    encryptWithPassword: {

        decryptsEncryptedData: function(test) {
            var text = "This is some sample text and numbers 12345! ",
                encrypted;
            lib.crypto.encryptWithPassword(text, "myPass")
                .then(function(output) {
                    encrypted = output;
                    return lib.crypto.decryptWithPassword(encrypted, "myPass");
                })
                .then(function(decrypted) {
                    test.notStrictEqual(encrypted, text, "Encrypted data should differ from raw");
                    test.ok(encrypted.length > 0, "Encrypted data should not be empty");
                    test.strictEqual(decrypted, text, "Decrypted data should match original (raw)");
                    test.done();
                })
                .catch(function(err) {
                    console.error(err);
                });
        }

    },

    encryptWithKeyFile: {

        encryptsAndDecrypts: function(test) {
            var text = "some random text";
            lib.crypto.encryptWithKeyFile(text, filename)
                .then(function(encrypted) {
                    return lib.crypto.decryptWithKeyFile(encrypted, filename);
                })
                .then(function(decrypted) {
                    test.strictEqual(decrypted, text, "Decrypted text should match original");
                    test.done();
                })
                .catch(function(err) {
                    console.error(err);
                });
        },

        encryptsAndDecryptsUsingBuffer: function(test) {
            fs.readFile(filename, function(err, data) {
                var text = "some random text";
                lib.crypto.encryptWithKeyFile(text, data)
                    .then(function(encrypted) {
                        return lib.crypto.decryptWithKeyFile(encrypted, data);
                    })
                    .then(function(decrypted) {
                        test.strictEqual(decrypted, text, "Decrypted text should match original");
                        test.done();
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
            });
        },

        encryptsAndDecryptsUsingBoth: function(test) {
            fs.readFile(filename, function(err, data) {
                var text = "some random text";
                lib.crypto.encryptWithKeyFile(text, data)
                    .then(function(encrypted) {
                        return lib.crypto.decryptWithKeyFile(encrypted, filename);
                    })
                    .then(function(decrypted) {
                        test.strictEqual(decrypted, text, "Decrypted text should match original");
                        test.done();
                    })
                    .catch(function(err) {
                        console.error(err);
                    });
            });
        }

    }

};
