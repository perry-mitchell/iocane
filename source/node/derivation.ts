import { pbkdf2 as derivePBKDF2 } from "pbkdf2";
import { DERIVED_KEY_ALGORITHM, HMAC_KEY_SIZE, PASSWORD_KEY_SIZE } from "../symbols";
import { DerivationMethod, DerivedKeyInfo } from "../types";

export async function deriveKeyFromPassword(
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
    const method = DerivationMethod.PBKDF2_SHA256;
    const bits = generateHMAC ? (PASSWORD_KEY_SIZE + HMAC_KEY_SIZE) * 8 : PASSWORD_KEY_SIZE * 8;
    const derivedKeyData = await pbkdf2(password, salt, rounds, bits);
    const derivedKeyHex = derivedKeyData.toString("hex");
    const dkhLength = derivedKeyHex.length;
    const keyBuffer = generateHMAC
        ? Buffer.from(derivedKeyHex.substr(0, dkhLength / 2), "hex")
        : Buffer.from(derivedKeyHex, "hex");
    return {
        hmac: generateHMAC
            ? Buffer.from(derivedKeyHex.substr(dkhLength / 2, dkhLength / 2), "hex")
            : null,
        key: keyBuffer,
        method,
        rounds: rounds,
        salt: salt
    };
}

async function pbkdf2(
    password: string,
    salt: string,
    rounds: number,
    bits: number
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        derivePBKDF2(
            password,
            salt,
            rounds,
            bits / 8,
            DERIVED_KEY_ALGORITHM,
            (err?: Error, key?: Buffer) => {
                if (err) {
                    return reject(err);
                }
                return resolve(key);
            }
        );
    });
}
