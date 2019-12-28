import { pbkdf2 as deriveKey } from "pbkdf2";

const DERIVED_KEY_ALGORITHM = "sha256";

/**
 * The default PBKDF2 function
 * @param password The password to use
 * @param salt The salt to use
 * @param rounds The number of iterations
 * @param bits The size of the key to generate, in bits
 * @returns A Promise that resolves with the hash
 */
export function pbkdf2(
    password: string,
    salt: string,
    rounds: number,
    bits: number
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        deriveKey(
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
