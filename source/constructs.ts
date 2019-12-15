export interface DecryptionFunction {
    (encryptedComponents: EncryptedComponents, keyDerivationInfo: DerivedKeyInfo): Promise<string>
}

export interface DerivedKeyInfo {
    salt: string,
    key: Buffer,
    hmac: Buffer | null,
    rounds: number
}

export interface EncryptedComponents {
    content: string,
    iv: string,
    salt: string,
    auth: string,
    rounds: number,
    method: EncryptionType
}

export interface EncryptionFunction {
    (text: string, keyDerivationInfo: DerivedKeyInfo, iv: Buffer): Promise<EncryptedComponents>
}

export enum EncryptionType {
    CBC = "cbc",
    GCM = "gcm"
}

export interface IVGenerationFunction {
    (): Promise<Buffer>
}

export interface KeyDerivationFunction {
    (password: string, salt: string, rounds: number, bits: number): Promise<Buffer>
}

export type PackedEncryptedContent = string;

export interface SaltGenerationFunction {
    (length: number): Promise<string>
}
