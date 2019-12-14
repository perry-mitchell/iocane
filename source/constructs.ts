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
