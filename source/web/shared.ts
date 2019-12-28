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

export function stringToArrayBuffer(string: string): ArrayBuffer {
    const encoder = new TextEncoder();
    return encoder.encode(string);
}
