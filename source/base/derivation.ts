import { DerivedKeyInfo } from "../base/constructs";

const HMAC_KEY_SIZE = 32;
const PASSWORD_KEY_SIZE = 32;

/**
 * Derive a key from a password
 * @param pbkdf2Gen The generator method
 * @param password The password to derive from
 * @param salt The salt
 * @param rounds The number of iterations
 * @param generateHMAC Enable HMAC key generation
 * @throws {Error} Rejects if no password is provided
 * @throws {Error} Rejects if no salt is provided
 * @throws {Error} Rejects if no rounds are provided
 * @returns A promise that resolves with derived key information
 */
export async function deriveFromPassword(
    pbkdf2Gen: Function,
    password: string,
    salt: string,
    rounds: number,
    generateHMAC: boolean = true
): Promise<DerivedKeyInfo> {
    if (!password) {
        throw new Error("Failed deriving key: Password must be provided");
    }
    if (!salt) {
        throw new Error("Failed deriving key: Salt must be provided");
    }
    if (!rounds || rounds <= 0) {
        throw new Error("Failed deriving key: Rounds must be greater than 0");
    }
    const bits = generateHMAC ? (PASSWORD_KEY_SIZE + HMAC_KEY_SIZE) * 8 : PASSWORD_KEY_SIZE * 8;
    const derivedKeyData = await pbkdf2Gen(password, salt, rounds, bits);
    const derivedKeyHex = derivedKeyData.toString("hex");
    const dkhLength = derivedKeyHex.length;
    const keyBuffer = generateHMAC
        ? new Buffer(derivedKeyHex.substr(0, dkhLength / 2), "hex")
        : new Buffer(derivedKeyHex, "hex");
    return {
        salt: salt,
        key: keyBuffer,
        rounds: rounds,
        hmac: generateHMAC
            ? new Buffer(derivedKeyHex.substr(dkhLength / 2, dkhLength / 2), "hex")
            : null
    };
}
