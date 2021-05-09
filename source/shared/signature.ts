const SIGNATURE_TEXT = "iocane/2";

export function getBinarySignature(): number[] {
    return SIGNATURE_TEXT.split("").map(char => char.charCodeAt(0));
}

export function getBinaryContentBorder(): number[] {
    return [1, 0, 0, 0, 0, 0, 0, 1];
}
