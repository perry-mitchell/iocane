export type BufferLike = Buffer | ArrayBuffer;

export type DataLike = string | Buffer | ArrayBuffer;

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

export interface EncryptedComponentsBase {
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
    algorithm: EncryptionAlgorithm;
    decrypt: (encrypted: DataLike, password: string) => Promise<DataLike>;
    derivationRounds: number;
    deriveKey: (password: string, salt: string) => Promise<DerivedKeyInfo>;
    encrypt: (text: DataLike, password: string) => Promise<DataLike>;
    setAlgorithm: (algo: EncryptionAlgorithm) => IocaneAdapter;
    setDerivationRounds: (rounds: number) => IocaneAdapter;
}

export type PackedEncryptedText = string;
