import { Configuration } from "./Configuration";
import {
    DerivedKeyInfo,
    EncryptionType,
    PackedEncryptedText,
    EncryptedComponents,
    EncryptedBinaryComponents
} from "./constructs";

/**
 * Encryption session
 */
export class Session extends Configuration {
    /**
     * Decrypt some text or data
     * @param content The content to decrypt
     * @param password The password to use for decryption
     * @returns Decrypted content
     * @memberof Session
     */
    async decrypt(
        content: string | Buffer | ArrayBuffer,
        password: string
    ): Promise<string | Buffer | ArrayBuffer> {
        const encryptedComponents =
            typeof content === "string"
                ? this.options.unpack_text(content)
                : this.options.unpack_data(content);
        const { salt, rounds, method } = encryptedComponents;
        const decryptMethod = this.options[`decryption_${method}`];
        const keyDerivationInfo = await this._deriveKey(password, salt, rounds, method);
        return decryptMethod(encryptedComponents, keyDerivationInfo);
    }

    /**
     * Encrypt some text or data
     * @param content The content to encrypt
     * @param password The password to use for encryption
     * @returns A promise that resolves with encrypted text or data
     * @memberof Session
     */
    async encrypt(
        content: string | Buffer | ArrayBuffer,
        password: string
    ): Promise<PackedEncryptedText | Buffer | ArrayBuffer> {
        const { generateIV, method } = this.options;
        const encryptMethod = this.options[`encryption_${method}`];
        const [keyDerivationInfo, iv] = await Promise.all([
            this._deriveNewKey(password),
            generateIV()
        ]);
        const encryptedComponents = await encryptMethod(content, keyDerivationInfo, iv);
        return typeof content === "string"
            ? this.options.pack_text(encryptedComponents as EncryptedComponents)
            : this.options.pack_data(encryptedComponents as EncryptedBinaryComponents);
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
