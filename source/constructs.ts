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

export enum EncryptionType {
    CBC = "cbc",
    GCM = "gcm"
}

export type PackedEncryptedContent = string;
