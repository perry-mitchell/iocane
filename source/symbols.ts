import { EncryptionAlgorithm } from "./types";

export const ALGO_DEFAULT = EncryptionAlgorithm.CBC;
export const DERIVED_KEY_ALGORITHM = "sha256";
export const DERIVED_KEY_ITERATIONS = 250000;
export const HMAC_KEY_SIZE = 32;
export const PASSWORD_KEY_SIZE = 32;
