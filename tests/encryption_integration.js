var lib = require("../source/index.js");

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    testDecryptsEncryptedData: function(test) {
        var text = "This is some sample text and numbers 12345! ",
            encrypted = lib.crypto.encryptWithPassword(text, "myPass"),
            decrypted = lib.crypto.decryptWithPassword(encrypted, "myPass");
        test.notStrictEqual(encrypted, text, "Encrypted data should differ from raw");
        test.ok(encrypted.length > 0, "Encrypted data should not be empty");
        test.strictEqual(decrypted, text, "Decrypted data should match original (raw)");
        test.done();
    }

};
