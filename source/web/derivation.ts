function arrayBufferToHexString(arrayBuffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(arrayBuffer);
    let hexString = "",
        nextHexByte: string;
    for (let i = 0; i < byteArray.byteLength; i += 1) {
        nextHexByte = byteArray[i].toString(16);
        if (nextHexByte.length < 2) {
            nextHexByte = "0" + nextHexByte;
        }
        hexString += nextHexByte;
    }
    return hexString;
}

function addHexSupportToArrayBuffer(arrayBuffer: ArrayBuffer): ArrayBuffer {
    const _toString = arrayBuffer.toString || function NOOP() {};
    arrayBuffer.toString = function(mode?: string): string {
        if (mode === "hex") {
            return arrayBufferToHexString(arrayBuffer);
        }
        return _toString.call(arrayBuffer, mode);
    };
    return arrayBuffer;
}

function checkBrowserSupport() {
    if (!window.TextEncoder || !window.TextDecoder) {
        throw new Error("TextEncoder is not available");
    }
}

/**
 * The default PBKDF2 function
 * @param password The password to use
 * @param salt The salt to use
 * @param rounds The number of iterations
 * @param bits The size of the key to generate, in bits
 * @returns A Promise that resolves with the hash
 */
export async function pbkdf2(
    password: string,
    salt: string,
    rounds: number,
    bits: number
): Promise<ArrayBuffer> {
    checkBrowserSupport();
    const subtleCrypto = window.crypto.subtle;
    const params = {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: stringToArrayBuffer(salt),
        iterations: rounds
    };
    const bytes = bits / 8;
    const keysLen = bytes / 2;
    // @ts-ignore // `importKey` is not entirely working as what's described in TS
    const keyData = await subtleCrypto.importKey(
        "raw",
        stringToArrayBuffer(password),
        { name: "PBKDF2" },
        /* not extractable: */ false,
        ["deriveBits"]
    );
    const derivedData = await subtleCrypto.deriveBits(params, keyData, bits);
    const [key1, key2] = await Promise.all([
        subtleCrypto.importKey("raw", derivedData.slice(0, keysLen), "AES-CBC", true, [
            "encrypt",
            "decrypt"
        ]),
        subtleCrypto.importKey("raw", derivedData.slice(keysLen, keysLen * 2), "AES-CBC", true, [
            "encrypt",
            "decrypt"
        ])
    ]);
    const [rawKey1, rawKey2] = await Promise.all([
        subtleCrypto.exportKey("raw", key1),
        subtleCrypto.exportKey("raw", key2)
    ]);
    return addHexSupportToArrayBuffer(joinBuffers(rawKey1, rawKey2));
}

function joinBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
}

function stringToArrayBuffer(string: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(string);
}
