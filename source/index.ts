import { Session } from "./Session";

/**
 * @module iocane
 */

/**
 * Start new encryption/decryption session
 * @returns New crypto session
 * @memberof module:iocane
 */
export function createSession(): Session {
    return new Session();
}
