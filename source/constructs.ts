export interface DerivedKeyInfo {
    salt: string,
    key: Buffer,
    hmac: Buffer,
    rounds: number
}

export interface EncryptedComponents {
    content: string,
    iv: string,
    salt: string,
    auth: string,
    rounds: number,
    method: EncryptionType
}

export enum EncryptionType {
    CBC = "cbc",
    GCM = "gcm"
}

export type PackedEncryptedContent = string;


// {
//     content,
//     iv,
//     salt,
//     auth,
//     rounds,
//     method
// }

// /**
//  * Derived key info
//  * @typedef DerivedKeyInfo
//  * @property {String} salt - The salt used
//  * @property {Buffer} key - The derived key
//  * @property {Buffer} hmac - The HMAC
//  * @property {Number} rounds - The number of rounds used
//  */
