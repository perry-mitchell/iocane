import { EncryptedComponents, EncryptionType, PackedEncryptedText } from "./constructs";
import { ALGO_DEFAULT } from "./shared";

const PBKDF2_ROUND_DEFAULT = 1000;

/**
 * Pack encrypted content components into the final encrypted form
 * @param encryptedComponents The encrypted components payload
 * @returns The final encrypted form
 */
export function packEncryptedText(encryptedComponents: EncryptedComponents): PackedEncryptedText {
    const { content, iv, salt, auth, rounds, method } = encryptedComponents;
    return [content, iv, salt, auth, rounds, method].join("$");
}

/**
 * Unpack encrypted content components from an encrypted string
 * @param encryptedContent The encrypted string
 * @returns The extracted components
 * @throws {Error} Throws if the number of components is incorrect
 */
export function unpackEncryptedText(encryptedContent: PackedEncryptedText): EncryptedComponents {
    const [content, iv, salt, auth, roundsRaw, methodRaw] = <
        [string, string, string, string, string, EncryptionType]
    >encryptedContent.split("$");
    // iocane was originally part of Buttercup's core package and used defaults from that originally.
    // There will be 4 components for pre 0.15.0 archives, and 5 in newer archives. The 5th component
    // is the pbkdf2 round count, which is optional:
    const rounds = roundsRaw ? parseInt(roundsRaw, 10) : PBKDF2_ROUND_DEFAULT;
    // Originally only "cbc" was supported, but GCM was added in version 1
    const method = methodRaw || ALGO_DEFAULT;
    return {
        content,
        iv,
        salt,
        auth,
        rounds,
        method
    };
}
