import { Session } from "./base/Session";
import { getDefaultOptions } from "./node/defaults";

/**
 * @module iocane
 */

/**
 * Start new encryption/decryption session
 * @returns New crypto session
 * @memberof module:iocane
 */
export function createSession(): Session {
    return new Session(getDefaultOptions());
}
