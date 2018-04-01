const crypto = require("crypto");
const { constantTimeCompare } = require("./timing.js");

const ENC_ALGORITHM = "aes-256-cbc";
const HMAC_ALGORITHM = "sha256";
const HMAC_KEY_SIZE = 32;
const PASSWORD_KEY_SIZE = 32;

/**
 * Default decryption method
 * @param {EncryptedComponents} encryptedComponents Encrypted components
 * @param {DerivedKeyInfo} keyDerivationInfo Key derivation information
 * @returns {Promise.<String>} A promise that resolves with the decrypted string
 */
function decryptCBC(encryptedComponents, keyDerivationInfo) {
    // Extract the components
    const encryptedContent = encryptedComponents.content;
    const iv = new Buffer(encryptedComponents.iv, "hex");
    const salt = encryptedComponents.salt;
    const hmacData = encryptedComponents.hmac;
    // Get HMAC tool
    const hmacTool = crypto.createHmac(HMAC_ALGORITHM, keyDerivationInfo.hmac);
    // Generate the HMAC
    hmacTool.update(encryptedContent);
    hmacTool.update(encryptedComponents.iv);
    hmacTool.update(salt);
    const newHmaxHex = hmacTool.digest("hex");
    // Check hmac for tampering
    if (constantTimeCompare(hmacData, newHmaxHex) !== true) {
        throw new Error("Authentication failed while decrypting content");
    }
    // Decrypt
    const decryptTool = crypto.createDecipheriv(ENC_ALGORITHM, keyDerivationInfo.key, iv);
    const decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
    return Promise.resolve(`${decryptedText}${decryptTool.final("utf8")}`);
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
            const encryptTool = crypto.createCipheriv(ENC_ALGORITHM, keyDerivationInfo.key, iv);
            const hmacTool = crypto.createHmac(HMAC_ALGORITHM, keyDerivationInfo.hmac);
            const pbkdf2Rounds = keyDerivationInfo.rounds;
            // Perform encryption
            let encryptedContent = encryptTool.update(text, "utf8", "base64");
            encryptedContent += encryptTool.final("base64");
            // Generate hmac
            hmacTool.update(encryptedContent);
            hmacTool.update(ivHex);
            hmacTool.update(keyDerivationInfo.salt);
            const hmacHex = hmacTool.digest("hex");
            return Promise.resolve({
                hmac: hmacHex,
                iv: ivHex,
                salt: keyDerivationInfo.salt,
                rounds: pbkdf2Rounds,
                content: encryptedContent
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
