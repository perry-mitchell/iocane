var lib = require("../source/index.js");

function deriveFromFile(salt, rounds) {
    return lib.derivation.deriveFromFile(__dirname + "/resources/gradient.png", salt, rounds)
        .catch(function(err) {
            console.error(err);
        });
}

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    deriveFromFile: {

        testDerivesDefault: function(test) {
            deriveFromFile()
                .then(function(derived) {
                    test.strictEqual(
                        derived.key.length,
                        lib.config.PASSWORD_KEY_SIZE,
                        "Derived key should be correct length"
                    );
                    test.strictEqual(
                        derived.hmac.length,
                        lib.config.HMAC_KEY_SIZE,
                        "HMAC should be correct length"
                    );
                    test.ok(derived.rounds >= lib.config.DERIVED_KEY_ITERATIONS_MIN &&
                        derived.rounds <= lib.config.DERIVED_KEY_ITERATIONS_MAX,
                        "Derived rounds should be in the acceptable range");
                    test.done();
                })
                .catch(function(err) {
                    console.error(err);
                });
        },

        testDerivesSameRepeatedly: function(test) {
            deriveFromFile().then(function(derived1) {
                deriveFromFile(derived1.salt, derived1.rounds).then(function(derived2) {
                    test.ok(derived2.key.equals(derived1.key), "Keys should match");
                    test.strictEqual(derived2.salt, derived1.salt, "Salts should match");
                    test.strictEqual(derived2.rounds, derived1.rounds, "Rounds should match");
                    test.done();
                });
            });
        }

    },

    deriveFromPassword: {

        testDerivesDefault: function(test) {
            lib.derivation.deriveFromPassword("abc")
                .then(function(derived) {
                    test.strictEqual(
                        derived.key.length,
                        lib.config.PASSWORD_KEY_SIZE,
                        "Derived key should be correct length"
                    );
                    test.strictEqual(
                        derived.hmac.length,
                        lib.config.HMAC_KEY_SIZE,
                        "HMAC should be correct length"
                    );
                    test.ok(derived.rounds >= lib.config.DERIVED_KEY_ITERATIONS_MIN &&
                        derived.rounds <= lib.config.DERIVED_KEY_ITERATIONS_MAX,
                        "Derived rounds should be in the acceptable range");
                    test.done();
                })
                .catch(function(err) {
                    console.error(err);
                });
        },

        testDerivesSameRepeatedly: function(test) {
            lib.derivation.deriveFromPassword("abc")
                .then(function(derived1) {
                    return lib.derivation.deriveFromPassword("abc", derived1.salt, derived1.rounds)
                        .then(function(derived2) {
                            test.ok(derived2.key.equals(derived1.key), "Keys should match");
                            test.strictEqual(derived2.salt, derived1.salt, "Salts should match");
                            test.strictEqual(derived2.rounds, derived1.rounds, "Rounds should match");
                            test.done();
                        });
                })
                .catch(function(err) {
                    console.error(err);
                });
        }

    }

};
