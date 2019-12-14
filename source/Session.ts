import { Configuration } from "./Configuration";
import { deriveFromPassword } from "./derivation";
import { packEncryptedContent, unpackEncryptedContent } from "./packing";
import { DerivedKeyInfo, EncryptionType, PackedEncryptedContent } from "./constructs";

/**
 * Encryption session
 */
export class Session extends Configuration {
    /**
     * Decrypt some text
     * @param text The text to decrypt
     * @param password The password to use for decryption
     * @returns Decrypted text
     * @memberof Session
     */
    async decrypt(text: string, password: string): Promise<string> {
        const encryptedComponents = unpackEncryptedContent(text);
        const { salt, rounds, method } = encryptedComponents;
        const decryptMethod = this.options[`decryption_${method}`];
        const keyDerivationInfo = await this._deriveKey(password, salt, rounds, method);
        return decryptMethod(encryptedComponents, keyDerivationInfo);
    }

    /**
     * Encrypt some text
     * @param text The text to encrypt
     * @param password The password to use for encryption
     * @returns A promise that resolves with encrypted text
     * @memberof Session
     */
    async encrypt(text: string, password: string): Promise<PackedEncryptedContent> {
        const { generateIV, method } = this.options;
        const encryptMethod = this.options[`encryption_${method}`];
        const [keyDerivationInfo, iv] = await Promise.all([this._deriveNewKey(password), generateIV()]);
        const encryptedComponents = await encryptMethod(text, keyDerivationInfo, iv);
        return packEncryptedContent(encryptedComponents);
    }

    /**
     * Derive a key using the current configuration
     * @param password The password
     * @param salt The salt
     * @param rounds Key derivation rounds
     * @param encryptionMethod Encryption method
     * @returns Derived key information
     * @protected
     * @memberof Session
     */
    _deriveKey(password: string, salt: string, rounds?: number, encryptionMethod?: EncryptionType): Promise<DerivedKeyInfo> {
        const { derivationRounds, deriveKey, method: optionsMethod } = this.options;
        const method = encryptionMethod || optionsMethod;
        const deriveKeyCall =
            method === EncryptionType.GCM
                ? () =>
                      deriveFromPassword(
                          deriveKey,
                          password,
                          salt,
                          rounds || derivationRounds,
                          /* HMAC: */ false
                      )
                : () => deriveFromPassword(deriveKey, password, salt, rounds || derivationRounds);
        return deriveKeyCall();
    }

    /**
     * Derive a new key using the current configuration
     * @param password The password
     * @returns Derived key information
     * @protected
     * @memberof Session
     */
    async _deriveNewKey(password: string): Promise<DerivedKeyInfo> {
        const { generateSalt, saltLength } = this.options;
        const salt = await generateSalt(saltLength);
        return this._deriveKey(password, salt);
    }
}
