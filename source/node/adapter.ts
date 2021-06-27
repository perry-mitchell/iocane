import {
    decryptCBC,
    decryptGCM,
    encryptCBC,
    encryptGCM,
    generateIV,
    generateSalt
} from "./encryption";
import { deriveKeyFromPassword } from "./derivation";
import { packEncryptedText, unpackEncryptedText } from "../shared/textPacking";
import { packEncryptedData, unpackEncryptedData } from "./dataPacking";
import { createDecryptStream, createEncryptStream } from "./stream";
import { ALGO_DEFAULT, DERIVED_KEY_ITERATIONS, SALT_LENGTH } from "../symbols";
import {
    BufferLike,
    DataLike,
    DerivedKeyInfo,
    EncryptedBinaryComponents,
    EncryptedComponents,
    EncryptionAlgorithm,
    IocaneAdapter
} from "../types";

export function createAdapter(): IocaneAdapter {
    const adapter: IocaneAdapter = {
        algorithm: ALGO_DEFAULT,
        createDecryptStream: (password: string) => createDecryptStream(adapter, password),
        createEncryptStream: (password: string) => createEncryptStream(adapter, password),
        decrypt: (encrypted: DataLike, password: string) => decrypt(adapter, encrypted, password),
        decryptCBC,
        decryptGCM,
        derivationRounds: DERIVED_KEY_ITERATIONS,
        deriveKey: (password: string, salt: string) => deriveKey(adapter, password, salt),
        encrypt: (text: DataLike, password: string) => encrypt(adapter, text, password),
        encryptCBC,
        encryptGCM,
        packData: packEncryptedData,
        packText: packEncryptedText,
        setAlgorithm: (algo: EncryptionAlgorithm) => {
            adapter.algorithm = algo;
            return adapter;
        },
        setDerivationRounds: (rounds: number) => {
            adapter.derivationRounds = rounds;
            return adapter;
        },
        unpackData: unpackEncryptedData,
        unpackText: unpackEncryptedText
    };
    return adapter;
}

async function decrypt(
    adapter: IocaneAdapter,
    encrypted: DataLike,
    password: string
): Promise<DataLike> {
    const encryptedComponents =
        typeof encrypted === "string"
            ? adapter.unpackText(encrypted)
            : adapter.unpackData(encrypted as Buffer);
    const { salt, rounds, method } = encryptedComponents;
    const decryptData = getDecryptionMethod(adapter, method);
    adapter.algorithm = method;
    adapter.derivationRounds = rounds;
    const keyDerivationInfo = await adapter.deriveKey(password, salt);
    return decryptData(encryptedComponents, keyDerivationInfo);
}

async function deriveKey(
    adapter: IocaneAdapter,
    password: string,
    salt: string
): Promise<DerivedKeyInfo> {
    const { algorithm, derivationRounds } = adapter;
    return deriveKeyFromPassword(password, salt, derivationRounds, hmacKeyRequired(algorithm));
}

async function encrypt(
    adapter: IocaneAdapter,
    text: DataLike,
    password: string
): Promise<DataLike> {
    const { algorithm } = adapter;
    const encryptData = getEncryptionMethod(adapter, algorithm);
    const salt = await generateSalt(SALT_LENGTH);
    const [keyDerivationInfo, iv] = await Promise.all([
        adapter.deriveKey(password, salt),
        generateIV()
    ]);
    const encryptedComponents = await encryptData(text, keyDerivationInfo, iv);
    return typeof text === "string"
        ? adapter.packText(encryptedComponents as EncryptedComponents)
        : adapter.packData(encryptedComponents as EncryptedBinaryComponents);
}

function getDecryptionMethod(
    adapter: IocaneAdapter,
    algo: EncryptionAlgorithm
): (
    encryptedComponents: EncryptedComponents | EncryptedBinaryComponents,
    keyDerivationInfo: DerivedKeyInfo
) => Promise<DataLike> {
    if (algo === EncryptionAlgorithm.CBC) {
        return adapter.decryptCBC;
    } else if (algo === EncryptionAlgorithm.GCM) {
        return adapter.decryptGCM;
    }
    throw new Error(`Invalid algorithm: ${algo}`);
}

function getEncryptionMethod(
    adapter: IocaneAdapter,
    algo: EncryptionAlgorithm
): (
    content: DataLike,
    keyDerivationInfo: DerivedKeyInfo,
    iv: BufferLike
) => Promise<EncryptedComponents | EncryptedBinaryComponents> {
    if (algo === EncryptionAlgorithm.CBC) {
        return adapter.encryptCBC;
    } else if (algo === EncryptionAlgorithm.GCM) {
        return adapter.encryptGCM;
    }
    throw new Error(`Invalid algorithm: ${algo}`);
}

function hmacKeyRequired(algo: EncryptionAlgorithm): boolean {
    return algo === EncryptionAlgorithm.GCM ? false : true;
}
