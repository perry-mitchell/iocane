import { Readable, Writable } from "stream";

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

export type EncryptedComponentsBase = EncryptedPayloadHeader & EncryptedPayloadFooter;

export interface EncryptedPayloadFooter {
    auth: string;
}

export interface EncryptedPayloadHeader {
    iv: string;
    salt: string;
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

export interface IocaneAdapterBase {
    algorithm: EncryptionAlgorithm;
    decrypt: (encrypted: DataLike, password: string) => Promise<DataLike>;
    derivationRounds: number;
    deriveKey: (password: string, salt: string) => Promise<DerivedKeyInfo>;
    encrypt: (text: DataLike, password: string) => Promise<DataLike>;
    packData: (
        encryptedComponents: EncryptedBinaryComponents | EncryptedComponentsBase
    ) => BufferLike;
    packText: (encryptedComponents: EncryptedComponents) => PackedEncryptedText;
    setAlgorithm: (algo: EncryptionAlgorithm) => IocaneAdapterBase;
    setDerivationRounds: (rounds: number) => IocaneAdapterBase;
    unpackData: (encryptedContent: BufferLike) => EncryptedBinaryComponents;
    unpackText: (encryptedContent: PackedEncryptedText) => EncryptedComponents;
}

export interface IocaneAdapter extends IocaneAdapterBase {
    createDecryptStream: (password: string) => Readable;
    createEncryptStream: (password: string) => Writable;
}

export type PackedEncryptedText = string;
