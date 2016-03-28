# iocane
NodeJS textual encryption library

[![Build Status](https://travis-ci.org/perry-mitchell/iocane.svg?branch=master)](https://travis-ci.org/perry-mitchell/iocane)

## About
Encrypting things is difficult, but it doesn't have to be. iocane encrypts text (not binary data) and outputs packed, encrypted text which can be decrypted by iocane. iocane uses strong, current-day encryption techniques to encrypt text, and doesn't reinvent anything. iocane uses PBKDF2 for key derivation, HMAC (SHA-256) for authentication and AES-256-CBC for encryption.

iocane was extracted from [Buttercup](https://github.com/buttercup-pw/buttercup-core)'s encryption process, and retains ties to the archiving process. Changes to iocane are subject to compatibility restraints with regards to the Buttercup suite of applications. This includes performance aspects of the browser-based versions.

## Usage
Encrypting text is simple:

```
var crypto = require("iocane").crypto;

var encryptedText = crypto.encryptWithPassword("some random text", "passw0rd");
```

Encrypted content can then be easily decrypted later:

```
var crypto = require("iocane").crypto;

var decryptedText = crypto.decryptWithPassword(encryptedText, "passw0rd");
```

There are a variety of other useful methods, like key derivation etc., available on the `iocane` base object.
