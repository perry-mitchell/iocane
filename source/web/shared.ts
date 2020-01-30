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

export function arrayBuffersEqual(buf1: ArrayBuffer, buf2: ArrayBuffer): Boolean {
    if (buf1.byteLength !== buf2.byteLength) return false;
    const dv1 = new Uint8Array(buf1);
    const dv2 = new Uint8Array(buf2);
    for (let i = 0; i < buf1.byteLength; i += 1) {
        if (dv1[i] !== dv2[i]) return false;
    }
    return true;
}

export function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
    const dataArr = Array.from(new Uint8Array(arrayBuffer));
    const rawOutput = dataArr.map(byte => String.fromCharCode(byte)).join("");
    return btoa(rawOutput);
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
    const decoder = new TextDecoder();
    return decoder.decode(arrayBuffer);
}

export function base64ToArrayBuffer(b64Str: string): ArrayBuffer {
    const raw = atob(b64Str);
    const output = new Uint8Array(new ArrayBuffer(raw.length));
    for (let i = 0; i < raw.length; i += 1) {
        output[i] = raw.charCodeAt(i);
    }
    return output;
}

export function concatArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer {
    if (buffers.length <= 0) {
        throw new Error("Failed concatenating array buffers: At least one must be passed");
    }
    const totalSize = buffers.reduce((total, buff) => total + buff.byteLength, 0);
    const dataArr = new Uint8Array(totalSize);
    let offset = 0;
    buffers.forEach(buff => {
        dataArr.set(new Uint8Array(buff), offset);
        offset += buff.byteLength;
    });
    return dataArr.buffer;
}

export function hexStringToArrayBuffer(string: string): ArrayBuffer {
    const rawArr = string.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16));
    const arr = new Uint8Array(rawArr);
    return arr.buffer;
}

export function stringToArrayBuffer(string: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(string);
}
