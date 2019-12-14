/**
 * Compare 2 values using time-secure checks
 * @param val1 A value
 * @param val2 Another value
 * @returns True if the values match
 */
function constantTimeCompare(val1: string, val2: string): boolean {
    let sentinel;
    if (val1.length !== val2.length) {
        return false;
    }
    for (var i = 0; i <= val1.length - 1; i += 1) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }
    return sentinel === 0;
}

module.exports = {
    constantTimeCompare
};
