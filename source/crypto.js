(function(module) {

    "use strict";

    var Crypto = require("crypto");

    var derivation = require("./derive.js"),
        generation = require("./generators.js"),
        packing = require("./packers.js"),
        security = require("./security.js"),
        config = require("./config.js");

    var lib = module.exports = {

        encrypt: function(text, keyDerivationInfo) {
            var iv = generation.generateIV(),
                ivHex = iv.toString("hex");
            var encryptTool = Crypto.createCipheriv(config.ENC_ALGORITHM, keyDerivationInfo.key, iv),
                hmacTool = Crypto.createHmac(config.HMAC_ALGORITHM, keyDerivationInfo.hmac),
                saltHex = keyDerivationInfo.salt.toString("hex"),
                pbkdf2Rounds = keyDerivationInfo.rounds;
            // Perform encryption
            var encryptedContent = encryptTool.update(text, "utf8", "base64");
            encryptedContent += encryptTool.final("base64");
            // Generate hmac
            hmacTool.update(encryptedContent);
            hmacTool.update(ivHex);
            hmacTool.update(saltHex);
            var hmacHex = hmacTool.digest("hex");
            // Return packed content
            return packing.packEncryptedContent(
                encryptedContent,
                ivHex,
                saltHex,
                hmacHex,
                pbkdf2Rounds
            );
        },

        encryptWithPassword: function(text, password) {
            var keyDerivationInfo = derivation.deriveFromPassword(password);
            return lib.encrypt(text, keyDerivationInfo);
        },

        decrypt: function(encryptedComponents, keyDerivationInfo) {
            // Extract the components
            var encryptedContent = encryptedComponents.content,
                iv = new Buffer(encryptedComponents.iv, "hex"),
                salt = encryptedComponents.salt,
                hmacData = encryptedComponents.hmac;
            // Get HMAC tool
            var hmacTool = Crypto.createHmac(config.HMAC_ALGORITHM, keyDerivationInfo.hmac);
            // Generate the HMAC
            hmacTool.update(encryptedContent);
            hmacTool.update(encryptedComponents.iv);
            hmacTool.update(salt);
            var newHmaxHex = hmacTool.digest("hex");
            // Check hmac for tampering
            if (security.constantTimeCompare(hmacData, newHmaxHex) !== true) {
                throw new Error("Encrypted content has been tampered with");
            }
            // Decrypt
            var decryptTool = Crypto.createDecipheriv(config.ENC_ALGORITHM, keyDerivationInfo.key, iv),
                decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
            return decryptedText + decryptTool.final("utf8");
        },

        decryptWithPassword: function(text, password) {
            var encryptedComponents = packing.unpackEncryptedContent(text),
                keyDerivationInfo = derivation.deriveFromPassword(
                    password,
                    encryptedComponents.salt,
                    encryptedComponents.rounds
                );
            return lib.decrypt(encryptedComponents, keyDerivationInfo);
        }

    };

})(module);
