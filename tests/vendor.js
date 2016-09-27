var lib = require("../source/index.js");

var path = require("path"),
    fs = require("fs");

var hash_file = require("hash_file");

var binFile = path.resolve(__dirname, "./resources/gradient.png");

function hashFile(filename) {
    return new Promise(function(resolve, reject) {
        hash_file(filename, "sha256", function(err, hash) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

function hashData(fileData) {
    return new Promise(function(resolve, reject) {
        hash_file(fileData, "sha256", function(err, hash) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
}

function readFile(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

module.exports = {

    hash_file: {

        createsSameHashForFilenameAndBuffer: function(test) {
            var dataHash;
            readFile(binFile)
                .then(function(data) {
                    return hashData(data);
                })
                .then(function(hash) {
                    dataHash = hash;
                    return hashFile(binFile);
                })
                .then(function(fileHash) {
                    test.ok(dataHash, "Hash should be valid");
                    test.ok(dataHash === fileHash, "Hashes should be identical");
                    test.strictEqual(dataHash.length, 64, "Hash length should be correct");
                    test.done();
                });
        }

    }

};
