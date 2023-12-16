import {
    DerivationMethod,
    EncryptedComponents,
    EncryptionAlgorithm,
    PackedEncryptedText
} from "../types";
import { ALGO_DEFAULT } from "../symbols";

/**
 * This is a legacy default from LONG ago - it is not used for new encryptions, and
 * is only applied when decrypting an old string that never specified the number of
 * rounds.
 */
const PBKDF2_ROUND_DEFAULT = 1000;

export function packEncryptedText(encryptedComponents: EncryptedComponents): PackedEncryptedText {
    const { content, derivation, iv, salt, auth, rounds, method } = encryptedComponents;
    return [content, iv, salt, auth, rounds, method, derivation].join("$");
}

export function unpackEncryptedText(encryptedContent: PackedEncryptedText): EncryptedComponents {
    const [content, iv, salt, auth, roundsRaw, methodRaw, deriveMethodRaw] = <
        [string, string, string, string, string, EncryptionAlgorithm, string]
    >encryptedContent.split("$");
    // iocane was originally part of Buttercup's core package and used defaults from that originally.
    // There will be 4 components for pre 0.15.0 archives, and 5 in newer archives. The 5th component
    // is the pbkdf2 round count, which was optional:
    const rounds = roundsRaw ? parseInt(roundsRaw, 10) : PBKDF2_ROUND_DEFAULT;
    // Encryption method: originally only "cbc" was supported, but GCM was added in version 1
    const method = methodRaw || ALGO_DEFAULT;
    // Derivation method: Original iocane strings used PBKDF2+SHA256 implicitly
    const deriveMethodNum = deriveMethodRaw
        ? parseInt(deriveMethodRaw, 10)
        : DerivationMethod.PBKDF2_SHA256;
    if (Object.values(DerivationMethod).includes(deriveMethodNum) === false) {
        throw new Error(
            `Failed unpacking encrypted content: Invalid key derivation type: ${deriveMethodRaw}`
        );
    }
    const derivation = deriveMethodNum as DerivationMethod;
    // Return results
    return {
        content,
        derivation,
        iv,
        salt,
        auth,
        rounds,
        method
    };
}
