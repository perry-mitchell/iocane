const crypto = require("crypto");

/**
 * Default decryption method
 * @param {EncryptedComponents} encryptedComponents Encrypted components
 * @param {DerivedKeyInfo} keyDerivationInfo Key derivation information
 * @returns {Promise.<String>} A promise that resolves with the decrypted string
 */
function decryptCBC(encryptedComponents, keyDerivationInfo) {
    // Extract the components
    var encryptedContent = encryptedComponents.content,
        iv = new Buffer(encryptedComponents.iv, "hex"),
        salt = encryptedComponents.salt,
        hmacData = encryptedComponents.hmac;
    // Get HMAC tool
    var hmacTool = crypto.createHmac(constants.HMAC_ALGORITHM, keyDerivationInfo.hmac);
    // Generate the HMAC
    hmacTool.update(encryptedContent);
    hmacTool.update(encryptedComponents.iv);
    hmacTool.update(salt);
    var newHmaxHex = hmacTool.digest("hex");
    // Check hmac for tampering
    if (security.constantTimeCompare(hmacData, newHmaxHex) !== true) {
        throw new Error("Authentication failed while decrypting content");
    }
    // Decrypt
    var decryptTool = crypto.createDecipheriv(constants.ENC_ALGORITHM, keyDerivationInfo.key, iv),
        decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
    return Promise.resolve(decryptedText + decryptTool.final("utf8"));
}

/**
 * Default AES-CBC encryption method
 * @param {String} text The text to encrypt
 * @param {DerivedKeyInfo} keyDerivationInfo Key derivation information
 * @returns {Promise.<EncryptedComponents>} A promise that resolves with encrypted components
 */
function encryptCBC(text, keyDerivationInfo) {
    return generateIV()
        .then(function _encrypt(iv) {
            const ivHex = iv.toString("hex");
            var encryptTool = crypto.createCipheriv(constants.ENC_ALGORITHM, keyDerivationInfo.key, iv),
                hmacTool = crypto.createHmac(constants.HMAC_ALGORITHM, keyDerivationInfo.hmac),
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
            return Promise.resolve({
                hmac: hmacHex,
                iv: ivHex,
                salt: saltHex,
                rounds: pbkdf2Rounds,
                encryptedContent
            });
        })
}

/**
 * Default IV generator
 * @returns {Promise.<Buffer>} A promise that resolves with an IV
 */
function generateIV() {
    return Promise.resolve(new Buffer(crypto.randomBytes(16)));
}

/**
 * Salt generator
 * @param {Number} length The length of the string to generate
 * @returns {Promise.<String>} A promise that resolves with a salt
 */
function generateSalt(length) {
    const genLen = length % 2 ? length + 1 : length;
    return Promise.resolve(Crypto.randomBytes(genLen / 2).toString("hex").substring(0, length))
}

module.exports = {
    decryptCBC,
    encryptCBC,
    generateIV,
    generateSalt
};
