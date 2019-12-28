export function addHexSupportToArrayBuffer(arrayBuffer: ArrayBuffer): ArrayBuffer {
    const _toString = arrayBuffer.toString || function NOOP() {};
    arrayBuffer.toString = function(mode?: string): string {
        if (mode === "hex") {
            return arrayBufferToHexString(arrayBuffer);
        }
        return _toString.call(arrayBuffer, mode);
    };
    return arrayBuffer;
}

export function arrayBufferToHexString(arrayBuffer: ArrayBuffer): string {
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

export function arrayBufferToString(arrayBuffer: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
}

export function base64ToArrayBuffer(b64Str: string): ArrayBuffer {
    const raw = atob(b64Str);
    const output = new Uint8Array(new ArrayBuffer(raw.length));
    for (let i = 0; i < raw.length; i += 1) {
        output[i] = raw.charCodeAt(i);
    }
    return output;
}

export function hexStringToArrayBuffer(string: string): ArrayBuffer {
    const rawArr = string.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16));
    const arr = new Uint8Array(rawArr);
    return arr.buffer;
}

export function joinBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
    const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    tmp.set(new Uint8Array(buffer1), 0);
    tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
    return tmp.buffer;
}

export function stringToArrayBuffer(string: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(string);
}
