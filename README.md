![iocane](https://raw.githubusercontent.com/perry-mitchell/iocane/master/iocane_header.jpg)

A powerful and easy-to-use **text** and **data** encryption library for **NodeJS** and the **web**.

[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) [![Build Status](https://travis-ci.org/perry-mitchell/iocane.svg?branch=master)](https://travis-ci.org/perry-mitchell/iocane) [![Downloads per month on NPM](https://img.shields.io/npm/dm/iocane.svg?maxAge=2592000)](https://www.npmjs.com/package/iocane/) [![npm version](https://badge.fury.io/js/iocane.svg)](https://www.npmjs.com/package/iocane/)

## About
**iocane** makes text and data encryption and decryption easy by bundling all the complicated processes into one succinct library. Encrypt and decrypt strings and buffers easily by using iocane's encryption format - string->string / buffer->buffer.

This library uses "sessions" for encryption and decryption. A session describes one encryption/decryption action, and can also have options be further overridden at the time of execution. Check the examples below for a better idea of how this process works.

**iocane** works in the browser, too. Both a **node version** and a **web version** are available:

```javascript
const iocane = require("iocane"); // node
```

```javascript
import * as iocane from "iocane/web" // web
```

### Features
**iocane** by default boasts the following features:

 * AES-CBC / AES-GCM encryption
 * 256bit keys
 * PBKDF2 key derivation (with 250k iterations)
 * ~11kb minified web version

## Installation
Install `iocane` as a dependency using `npm`:

```shell
npm install iocane --save
```

## Usage
**iocane** can be easily used to encrypt text:

```javascript
const { createSession } = require("iocane");

createSession()
    .encrypt("some secret text", "myPassword")
    .then(encryptedString => {
        // do something with the encrypted text
    });
```

Decryption is even simpler, as instructions on _how_ to decrypt the payload is included in the payload itself:

```javascript
createSession()
    .decrypt(encryptedString, "myPassword")
    .then(decryptedString => {
        // ...
    });
```

During encryption, you can override a variety of options:

```javascript
createSession()
    .use("gcm") // use GCM encryption
    .setDerivationRounds(300000)
    .encrypt(target, password);
```

Each cryptographic function can be overridden:

```javascript
createSession()
    .overrideDecryption("cbc", cbcDecFn)
    .overrideDecryption("gcm", gcmDecFn)
    .overrideEncryption("cbc", cbcEncFn)
    .overrideEncryption("gcm", gcmEncFn)
    .overrideIVGeneration(genIV)
    .overrideKeyDerivation(deriveKey)
    .overrideSaltGeneration(genSalt)
    .encrypt(/* ... */);
```

_Note that the default encryption mode is `"cbc"` (AES-CBC encryption)._

You can check out the [API documentation](API.md) for more information.

### Encrypting and decrypting data buffers

Iocane can handle buffers the same way it handles strings - just pass them into the same encrypt/decrypt functions:

```javascript
const iocane = require("iocane");
const fs = require("fs");

createSession()
    .use("cbc")
    .encrypt(fs.readFileSync("./test.bin"), "passw0rd")
    .then(data => fs.writeFileSync("./test.bin.enc", data));
```

_The same can be performed on the web, with array buffers in place of standard buffers._

### Web usage

When building a project for the web, make sure to use the web-based version of iocane. Bundling the node version will create super-large bundles and result in slow encryption and decryption. iocane for the web uses UMD so it can be imported or simply loaded straight in the browser as a `<script>`.

If you load iocane directly in the browser, it will create a global namespace at `window.iocane` (eg. `window.iocane.createSession`).

## Supported environments
**iocane** supports NodeJS version 10 and above. Node 8 was supported in `3.x` and versions prior to 8 were supported in `1.x`.

**iocane** is used in the browser as well - it works everywhere that `SubtleCrypto`, `ArrayBuffer` and `Promise` are available.

_Note: iocane is written in TypeScript, though versions before v2 where written in JavaScript._

## Buttercup
**iocane** was originally part of the [Buttercup](https://github.com/buttercup) suite. Buttercup is a supported dependent of iocane and efforts are made to align iocane with Buttercup's target platforms and uses.
