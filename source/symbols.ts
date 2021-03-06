import { EncryptionAlgorithm } from "./types";

export const ALGO_DEFAULT = EncryptionAlgorithm.CBC;
export const DERIVED_KEY_ALGORITHM = "sha256";
export const DERIVED_KEY_ITERATIONS = 250000;
export const HMAC_KEY_SIZE = 32;
export const NODE_ENC_ALGORITHM_CBC = "aes-256-cbc";
export const NODE_ENC_ALGORITHM_GCM = "aes-256-gcm";
export const NODE_HMAC_ALGORITHM = "sha256";
export const PASSWORD_KEY_SIZE = 32;
export const SALT_LENGTH = 12;
export const SIZE_ENCODING_BYTES = 4;
