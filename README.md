# iocane
NodeJS textual encryption library

[![Buttercup](https://dl.dropboxusercontent.com/u/16657557/Works/Buttercup/badge.svg)](https://buttercup.pw) [![Build Status](https://travis-ci.org/perry-mitchell/iocane.svg?branch=master)](https://travis-ci.org/perry-mitchell/iocane)

## About
Encrypting things is difficult, but it doesn't have to be. iocane encrypts text (not binary data) and outputs packed, encrypted text which can be decrypted by iocane. iocane uses strong, current-day encryption techniques to encrypt text, and doesn't reinvent anything. iocane uses PBKDF2 for key derivation, HMAC (SHA-256) for authentication and AES-256-CBC for encryption.

iocane was extracted from [Buttercup](https://github.com/buttercup-pw/buttercup-core)'s encryption process, and retains ties to the archiving process. Changes to iocane are subject to compatibility restraints with regards to the Buttercup suite of applications. This includes performance aspects of the browser-based versions.

### Features
 - AES 256 bit CBC encryption
 - SHA-256 HMAC
 - 6-8k PBKDF2 round derived keys (SHA-256)
 - Key-file support (path or buffer)

### Node compatibility
iocane makes use of ES6 features available in NodeJS 4.2 and onwards.

## Usage
Encrypting text is simple:

```
var crypto = require("iocane").crypto;

crypto
    .encryptWithPassword("some random text", "passw0rd")
    .then(encrypted => { });
```

Encrypted content can then be easily decrypted later:

```
var crypto = require("iocane").crypto;

crypto
    .decryptWithPassword(encryptedText, "passw0rd")
    .then(decrypted => { });
```

You can also use a file to perform encryption:

```
crypto
    .encryptWithKeyFile("some random text", "/tmp/somefile.bin")
    .then(encrypted => { });
```

The file to use can also be stored in a Buffer:

```
fs.readFile("/tmp/somefile.bin", function(err, data) {
    crypto
        .encryptWithKeyFile("some random text", data)
        .then(encrypted => { });
});
```

There are a variety of other useful methods, like key derivation etc., available on the `iocane` base object.

### Overriding the built-in PBKDF2 function
You can override the built in key derivation method like so:

```
var iocane = require("iocane");
iocane.components.setPBKDF2(function(password, salt, rounds, bits, algorithm) {
    // do something
    // return Promise.<Buffer>
});
```

This is useful when using iocane in other environments, like the browser.
