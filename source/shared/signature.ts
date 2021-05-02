export function getBinarySignature(): number[] {
    return "iocane/2".split("").map(char => char.charCodeAt(0));
}
