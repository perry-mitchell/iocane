import { EncryptionType } from "../types";

export const ALGO_DEFAULT = EncryptionType.CBC;
export const DERIVED_KEY_ITERATIONS = 250000;

export const ENC_ALGORITHM_CBC = "aes-256-cbc";
export const ENC_ALGORITHM_GCM = "aes-256-gcm";
export const HMAC_ALGORITHM = "sha256";
