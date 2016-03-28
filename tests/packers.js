var lib = require("../source/index.js");

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    packEncryptedContent: {

        testPacksComponents: function(test) {
            var packed = lib.packers.packEncryptedContent(
                    "content", "#iv#", "@salt@", "^hmac^", "12345"
                ),
                contentIndex = packed.indexOf("content"),
                ivIndex = packed.indexOf("#iv#"),
                saltIndex = packed.indexOf("@salt@"),
                hmacIndex = packed.indexOf("^hmac^"),
                roundIndex = packed.indexOf("12345");
            test.ok(contentIndex >= 0, "Content should be at the start");
            test.ok(ivIndex > contentIndex, "Content should precede IV");
            test.ok(saltIndex > ivIndex, "IV should precede Salt");
            test.ok(hmacIndex > saltIndex, "Salt should precede HMAC");
            test.ok(roundIndex > hmacIndex, "HMAC should precede Rounds");
            test.done();
        }

    },

    unpackEncryptedContent: {

        testUnpacksCorrectly: function(test) {
            var packedContent = "someContent$myIV$salt$123hmac$8600",
                components = lib.packers.unpackEncryptedContent(packedContent);
            test.strictEqual(components.content, "someContent", "Content should be set correctly");
            test.strictEqual(components.iv, "myIV", "IV should be set correctly");
            test.strictEqual(components.salt, "salt", "Salt should be set correctly");
            test.strictEqual(components.hmac, "123hmac", "HMAC should be set correctly");
            test.strictEqual(components.rounds, 8600, "Rounds should be set correctly");
            test.done();
        }

    }

};
