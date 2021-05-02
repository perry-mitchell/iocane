export type BufferLike = Buffer | ArrayBuffer;

export interface DerivedKeyInfo {
    salt: string;
    key: Buffer | ArrayBuffer;
    hmac: Buffer | ArrayBuffer | null;
    rounds: number;
}

export interface EncryptedBinaryComponents extends EncryptedComponentsBase {
    content: Buffer | ArrayBuffer;
}

export interface EncryptedComponents extends EncryptedComponentsBase {
    content: string;
}

interface EncryptedComponentsBase {
    iv: string;
    salt: string;
    auth: string;
    rounds: number;
    method: EncryptionAlgorithm;
}

export enum EncryptionAlgorithm {
    CBC = "cbc",
    GCM = "gcm"
}

export interface EncryptFunction {
    (target: string | BufferLike, options?: EncryptFunctionOptions): Promise<any>;
}

export interface EncryptFunctionOptions {
    algo?: EncryptionAlgorithm;
}

export interface IocaneAdapter {
    decryptText: (encrypted: string, password: string) => Promise<string>;
    encryptText: (text: string, password: string, algo?: EncryptionAlgorithm) => Promise<string>;
}

export type PackedEncryptedText = string;
