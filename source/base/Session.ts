import { Configuration } from "./Configuration";
import { DerivedKeyInfo, EncryptionType, PackedEncryptedText } from "./constructs";

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
        const unpack = this.options.unpack_text;
        const encryptedComponents = unpack(text);
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
    async encrypt(text: string, password: string): Promise<PackedEncryptedText> {
        const { generateIV, method } = this.options;
        const encryptMethod = this.options[`encryption_${method}`];
        const pack = this.options.pack_text;
        const [keyDerivationInfo, iv] = await Promise.all([
            this._deriveNewKey(password),
            generateIV()
        ]);
        const encryptedComponents = await encryptMethod(text, keyDerivationInfo, iv);
        return pack(encryptedComponents);
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
    _deriveKey(
        password: string,
        salt: string,
        rounds?: number,
        encryptionMethod?: EncryptionType
    ): Promise<DerivedKeyInfo> {
        const { derivationRounds, method: optionsMethod, pbkdf2 } = this.options;
        const method = encryptionMethod || optionsMethod;
        const deriveFromPassword = this.options.deriveKey;
        const deriveKeyCall =
            method === EncryptionType.GCM
                ? () =>
                      deriveFromPassword(
                          pbkdf2,
                          password,
                          salt,
                          rounds || derivationRounds,
                          /* HMAC: */ false
                      )
                : () => deriveFromPassword(pbkdf2, password, salt, rounds || derivationRounds);
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
