import { EncryptedComponents, EncryptionAlgorithm, PackedEncryptedText } from "../types";
import { ALGO_DEFAULT } from "../symbols";

const PBKDF2_ROUND_DEFAULT = 1000;

export function packEncryptedText(encryptedComponents: EncryptedComponents): PackedEncryptedText {
    const { content, iv, salt, auth, rounds, method } = encryptedComponents;
    return [content, iv, salt, auth, rounds, method].join("$");
}

export function unpackEncryptedText(encryptedContent: PackedEncryptedText): EncryptedComponents {
    const [content, iv, salt, auth, roundsRaw, methodRaw] = <
        [string, string, string, string, string, EncryptionAlgorithm]
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
