"use strict";

const path = require("path");
const lib = require("../source/index.js");

module.exports = {

    setUp: function(done) {
        (done)();
    },

    tearDown: function(done) {
        (done)();
    },

    generateFileHash: {

        generatesCorrectHash: function(test) {
            lib.generators.generateFileHash(path.join(__dirname, "/resources/gradient.png"))
                .then(function(hash) {
                    test.strictEqual(hash, "06a6ff94e408765d01a07fdb3987e20636220cb917172efdd2e2467e28b3cc3e",
                        "Hash should match");
                    test.done();
                })
                .catch(function(err) {
                    console.error(err);
                });
        }

    },

    generateIV: {

        generatesCorrectLength: function(test) {
            lib.generators
                .generateIV()
                .then(iv => {
                    test.strictEqual(iv.length, 16, "IV should be correct size");
                    test.done();
                });
        }

    },

    generateSalt: {

        generatesDifferentLengths: function(test) {
            Promise
                .all([
                    lib.generators.generateSalt(10),
                    lib.generators.generateSalt(35)
                ])
                .then(function(salts) {
                    const [salt10, salt35] = salts;
                    test.strictEqual(salt10.length, 10, "Salt should be correct length (10)");
                    test.strictEqual(salt35.length, 35, "Salt should be correct length (35)");
                    test.done();
                });
        }

    }

};
