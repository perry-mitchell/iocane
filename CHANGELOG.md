# iocane changelog

## v4.1.0
_2020-05-31_

 * `overridePBKDF2` session method for overriding the PBKDF2 implementation
 * Deprecated `overrideKeyDerivation`

## v4.0.0
_2020-01-30_

 * Data encryption and decryption, via buffers

## v3.0.0
_2020-01-01_

 * First-party **web version**
 * `deriveKey` override split into `deriveKey` (wrapper) and `pbkdf2`

## v2.0.0
_2019-12-16_

 * Migrate to TypeScript
 * Drop support for Node v6
 * Remove global `configure`
 * **Bugfix**:
   * Several payload parameters misnamed, such as `mode` instead of `method`

## v1.0.2
_2018-10-09_

 * Update dependencies (detected vulnerabilities)

## v1.0.1
_2018-09-11_

 * Re-release to fix latest version

## **1.0.0** (1.0.0-rc1, 1.0.0-rc2)
_2018-04-02_

 * New, simpler API
   * Easier overriding of crypto methods
 * AES-GCM support
 * Global configuration with session-level overrides (eg. key derivation rounds)
 * Increased salt entropy (base64)
 * Dropped features
   * Encryption using key files has been removed

## 0.10.2
_2018-05-27_

 * Future proofing

## 0.10.1
_2017-11-17_

**Security update**

 * [#21 Fix for `debug` package vulnerability](https://github.com/perry-mitchell/iocane/pull/21) (as described in the security issue [here](https://nodesecurity.io/advisories/534))

## 0.10.0
_2017-09-03_

 * Overrides for salt and IV generation

## 0.9.0
_2017-08-28_

 * Core encryption methods now async

## 0.8.0
_2017-08-24_

 * Add support for overriding built in encryption and decryption methods

## 0.7.0
_2017-04-27_

 * Add support for configuring PBKDF2 round boundaries externally

## 0.6.0
_2017-03-06_

 * Increase PBKDF2 rounds to 200-250k

## 0.5.0

 * [Debug](https://github.com/visionmedia/debug) support
 * Improved error message when decrypting with wrong password
