
<a name="readmemd"></a>

[iocane](#readmemd)

# iocane

## Index

### Enumerations

* [EncryptionType](#enumsencryptiontypemd)

### Classes

* [Configuration](#classesconfigurationmd)
* [Session](#classessessionmd)

### Interfaces

* [ConfigurationOptions](#interfacesconfigurationoptionsmd)
* [DecryptionFunction](#interfacesdecryptionfunctionmd)
* [DerivedKeyInfo](#interfacesderivedkeyinfomd)
* [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)
* [EncryptedComponents](#interfacesencryptedcomponentsmd)
* [EncryptionFunction](#interfacesencryptionfunctionmd)
* [IVGenerationFunction](#interfacesivgenerationfunctionmd)
* [KeyDerivationFunction](#interfaceskeyderivationfunctionmd)
* [PBKDF2Function](#interfacespbkdf2functionmd)
* [PackDataFunction](#interfacespackdatafunctionmd)
* [PackTextFunction](#interfacespacktextfunctionmd)
* [SaltGenerationFunction](#interfacessaltgenerationfunctionmd)
* [UnpackDataFunction](#interfacesunpackdatafunctionmd)
* [UnpackTextFunction](#interfacesunpacktextfunctionmd)

### Type aliases

* [PackedEncryptedText](#packedencryptedtext)

### Variables

* [ALGO_DEFAULT](#const-algo_default)
* [DERIVED_KEY_ALGORITHM](#const-derived_key_algorithm)
* [DERIVED_KEY_ITERATIONS](#const-derived_key_iterations)
* [ENC_ALGORITHM_CBC](#const-enc_algorithm_cbc)
* [ENC_ALGORITHM_GCM](#const-enc_algorithm_gcm)
* [HMAC_ALGORITHM](#const-hmac_algorithm)
* [HMAC_KEY_SIZE](#const-hmac_key_size)
* [METHODS](#const-methods)
* [PASSWORD_KEY_SIZE](#const-password_key_size)
* [PBKDF2_ROUND_DEFAULT](#const-pbkdf2_round_default)
* [SALT_LENGTH](#const-salt_length)
* [SIZE_ENCODING_BYTES](#const-size_encoding_bytes)

### Functions

* [constantTimeCompare](#constanttimecompare)
* [createSession](#createsession)
* [decryptCBC](#decryptcbc)
* [decryptGCM](#decryptgcm)
* [deriveFromPassword](#derivefrompassword)
* [encryptCBC](#encryptcbc)
* [encryptGCM](#encryptgcm)
* [generateIV](#generateiv)
* [generateSalt](#generatesalt)
* [getBinarySignature](#getbinarysignature)
* [getDefaultOptions](#getdefaultoptions)
* [packEncryptedData](#packencrypteddata)
* [packEncryptedText](#packencryptedtext)
* [pbkdf2](#pbkdf2)
* [sizeToBuffer](#sizetobuffer)
* [unpackEncryptedData](#unpackencrypteddata)
* [unpackEncryptedText](#unpackencryptedtext)
* [validateEncryptionMethod](#validateencryptionmethod)

## Type aliases

###  PackedEncryptedText

Ƭ **PackedEncryptedText**: *string*

*Defined in [base/constructs.ts:147](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L147)*

An encrypted string payload, containing all necessary data for
decryption to occur (besides the password).

## Variables

### `Const` ALGO_DEFAULT

• **ALGO_DEFAULT**: *[CBC](#cbc)* =  EncryptionType.CBC

*Defined in [base/shared.ts:3](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/shared.ts#L3)*

___

### `Const` DERIVED_KEY_ALGORITHM

• **DERIVED_KEY_ALGORITHM**: *"sha256"* = "sha256"

*Defined in [node/derivation.ts:4](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/derivation.ts#L4)*

___

### `Const` DERIVED_KEY_ITERATIONS

• **DERIVED_KEY_ITERATIONS**: *250000* = 250000

*Defined in [base/shared.ts:4](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/shared.ts#L4)*

___

### `Const` ENC_ALGORITHM_CBC

• **ENC_ALGORITHM_CBC**: *"aes-256-cbc"* = "aes-256-cbc"

*Defined in [node/encryption.ts:10](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/encryption.ts#L10)*

___

### `Const` ENC_ALGORITHM_GCM

• **ENC_ALGORITHM_GCM**: *"aes-256-gcm"* = "aes-256-gcm"

*Defined in [node/encryption.ts:11](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/encryption.ts#L11)*

___

### `Const` HMAC_ALGORITHM

• **HMAC_ALGORITHM**: *"sha256"* = "sha256"

*Defined in [node/encryption.ts:12](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/encryption.ts#L12)*

___

### `Const` HMAC_KEY_SIZE

• **HMAC_KEY_SIZE**: *32* = 32

*Defined in [node/derivation.ts:5](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/derivation.ts#L5)*

___

### `Const` METHODS

• **METHODS**: *[EncryptionType](#enumsencryptiontypemd)[]* =  [EncryptionType.CBC, EncryptionType.GCM]

*Defined in [base/Configuration.ts:12](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L12)*

___

### `Const` PASSWORD_KEY_SIZE

• **PASSWORD_KEY_SIZE**: *32* = 32

*Defined in [node/derivation.ts:6](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/derivation.ts#L6)*

___

### `Const` PBKDF2_ROUND_DEFAULT

• **PBKDF2_ROUND_DEFAULT**: *1000* = 1000

*Defined in [base/packing.ts:4](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/packing.ts#L4)*

___

### `Const` SALT_LENGTH

• **SALT_LENGTH**: *12* = 12

*Defined in [node/defaults.ts:19](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/defaults.ts#L19)*

___

### `Const` SIZE_ENCODING_BYTES

• **SIZE_ENCODING_BYTES**: *4* = 4

*Defined in [node/packing.ts:6](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/packing.ts#L6)*

## Functions

###  constantTimeCompare

▸ **constantTimeCompare**(`val1`: string, `val2`: string): *boolean*

*Defined in [base/timing.ts:7](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/timing.ts#L7)*

Compare 2 values using time-secure checks

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`val1` | string | A value |
`val2` | string | Another value |

**Returns:** *boolean*

True if the values match

___

###  createSession

▸ **createSession**(): *[Session](#classessessionmd)*

*Defined in [index.node.ts:13](https://github.com/perry-mitchell/iocane/blob/e064790/source/index.node.ts#L13)*

Start new encryption/decryption session

**`memberof`** module:iocane

**Returns:** *[Session](#classessessionmd)*

New crypto session

___

###  decryptCBC

▸ **decryptCBC**(`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd) | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd), `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd)): *Promise‹string | Buffer›*

*Defined in [node/encryption.ts:20](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/encryption.ts#L20)*

Decrypt text using AES-CBC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`encryptedComponents` | [EncryptedComponents](#interfacesencryptedcomponentsmd) &#124; [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd) | Encrypted components |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) | Key derivation information |

**Returns:** *Promise‹string | Buffer›*

A promise that resolves with the decrypted string

___

###  decryptGCM

▸ **decryptGCM**(`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd) | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd), `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd)): *Promise‹string | Buffer›*

*Defined in [node/encryption.ts:63](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/encryption.ts#L63)*

Decrypt text using AES-GCM

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`encryptedComponents` | [EncryptedComponents](#interfacesencryptedcomponentsmd) &#124; [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd) | Encrypted components |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) | Key derivation information |

**Returns:** *Promise‹string | Buffer›*

A promise that resolves with the decrypted string

___

###  deriveFromPassword

▸ **deriveFromPassword**(`pbkdf2Gen`: [PBKDF2Function](#interfacespbkdf2functionmd), `password`: string, `salt`: string, `rounds`: number, `generateHMAC`: boolean): *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

*Defined in [node/derivation.ts:20](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/derivation.ts#L20)*

Derive a key from a password

**`throws`** {Error} Rejects if no password is provided

**`throws`** {Error} Rejects if no salt is provided

**`throws`** {Error} Rejects if no rounds are provided

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`pbkdf2Gen` | [PBKDF2Function](#interfacespbkdf2functionmd) | - | The generator method |
`password` | string | - | The password to derive from |
`salt` | string | - | The salt |
`rounds` | number | - | The number of iterations |
`generateHMAC` | boolean | true | Enable HMAC key generation |

**Returns:** *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

A promise that resolves with derived key information

___

###  encryptCBC

▸ **encryptCBC**(`content`: string | Buffer, `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd), `iv`: Buffer): *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd) | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)›*

*Defined in [node/encryption.ts:96](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/encryption.ts#L96)*

Encrypt text using AES-CBC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`content` | string &#124; Buffer | - |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) | Key derivation information |
`iv` | Buffer | A buffer containing the IV |

**Returns:** *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd) | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)›*

A promise that resolves with encrypted components

___

###  encryptGCM

▸ **encryptGCM**(`content`: string | Buffer, `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd), `iv`: Buffer): *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd) | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)›*

*Defined in [node/encryption.ts:145](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/encryption.ts#L145)*

Encrypt text using AES-GCM

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`content` | string &#124; Buffer | - |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) | Key derivation information |
`iv` | Buffer | A buffer containing the IV |

**Returns:** *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd) | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)›*

A promise that resolves with encrypted components

___

###  generateIV

▸ **generateIV**(): *Promise‹Buffer›*

*Defined in [node/encryption.ts:189](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/encryption.ts#L189)*

IV generator

**Returns:** *Promise‹Buffer›*

A newly generated IV

___

###  generateSalt

▸ **generateSalt**(`length`: number): *Promise‹string›*

*Defined in [node/encryption.ts:199](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/encryption.ts#L199)*

Generate a random salt

**`throws`** {Error} Rejects if length is invalid

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number | The length of the string to generate |

**Returns:** *Promise‹string›*

A promise that resolves with a salt (hex)

___

###  getBinarySignature

▸ **getBinarySignature**(): *number[]*

*Defined in [base/packing.ts:6](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/packing.ts#L6)*

**Returns:** *number[]*

___

###  getDefaultOptions

▸ **getDefaultOptions**(): *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Defined in [node/defaults.ts:25](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/defaults.ts#L25)*

Get the default options

**Returns:** *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

Default configuration options

___

###  packEncryptedData

▸ **packEncryptedData**(`encryptedComponents`: [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)): *Buffer*

*Defined in [node/packing.ts:8](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/packing.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`encryptedComponents` | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd) |

**Returns:** *Buffer*

___

###  packEncryptedText

▸ **packEncryptedText**(`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd)): *[PackedEncryptedText](#packedencryptedtext)*

*Defined in [base/packing.ts:15](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/packing.ts#L15)*

Pack encrypted content components into the final encrypted form

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`encryptedComponents` | [EncryptedComponents](#interfacesencryptedcomponentsmd) | The encrypted components payload |

**Returns:** *[PackedEncryptedText](#packedencryptedtext)*

The final encrypted form

___

###  pbkdf2

▸ **pbkdf2**(`password`: string, `salt`: string, `rounds`: number, `bits`: number): *Promise‹Buffer›*

*Defined in [node/derivation.ts:61](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/derivation.ts#L61)*

The default PBKDF2 function

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`password` | string | The password to use |
`salt` | string | The salt to use |
`rounds` | number | The number of iterations |
`bits` | number | The size of the key to generate, in bits |

**Returns:** *Promise‹Buffer›*

A Promise that resolves with the hash

___

###  sizeToBuffer

▸ **sizeToBuffer**(`size`: number): *Buffer*

*Defined in [node/packing.ts:29](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/packing.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`size` | number |

**Returns:** *Buffer*

___

###  unpackEncryptedData

▸ **unpackEncryptedData**(`encryptedContent`: Buffer): *[EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)*

*Defined in [node/packing.ts:35](https://github.com/perry-mitchell/iocane/blob/e064790/source/node/packing.ts#L35)*

**Parameters:**

Name | Type |
------ | ------ |
`encryptedContent` | Buffer |

**Returns:** *[EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)*

___

###  unpackEncryptedText

▸ **unpackEncryptedText**(`encryptedContent`: [PackedEncryptedText](#packedencryptedtext)): *[EncryptedComponents](#interfacesencryptedcomponentsmd)*

*Defined in [base/packing.ts:26](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/packing.ts#L26)*

Unpack encrypted content components from an encrypted string

**`throws`** {Error} Throws if the number of components is incorrect

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`encryptedContent` | [PackedEncryptedText](#packedencryptedtext) | The encrypted string |

**Returns:** *[EncryptedComponents](#interfacesencryptedcomponentsmd)*

The extracted components

___

###  validateEncryptionMethod

▸ **validateEncryptionMethod**(`method`: [EncryptionType](#enumsencryptiontypemd)): *void*

*Defined in [base/Configuration.ts:19](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L19)*

Validate an encryption method specification

**`throws`** {Error} Throws if the method is not valid

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | The method to validate |

**Returns:** *void*

# Enums


<a name="enumsencryptiontypemd"></a>

[iocane](#readmemd) › [EncryptionType](#enumsencryptiontypemd)

## Enumeration: EncryptionType

Encryption type enumeration - sets the type of encryption to use and
is calculated automatically for decryption.

### Index

#### Enumeration members

* [CBC](#cbc)
* [GCM](#gcm)

### Enumeration members

####  CBC

• **CBC**: = "cbc"

*Defined in [base/constructs.ts:118](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L118)*

___

####  GCM

• **GCM**: = "gcm"

*Defined in [base/constructs.ts:119](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L119)*

# Classes


<a name="classesconfigurationmd"></a>

[iocane](#readmemd) › [Configuration](#classesconfigurationmd)

## Class: Configuration

System configuration

### Hierarchy

* **Configuration**

  ↳ [Session](#classessessionmd)

### Index

#### Constructors

* [constructor](#constructor)

#### Properties

* [_baseOptions](#_baseoptions)
* [_options](#_options)

#### Accessors

* [options](#options)

#### Methods

* [overrideDecryption](#overridedecryption)
* [overrideEncryption](#overrideencryption)
* [overrideIVGeneration](#overrideivgeneration)
* [overrideKeyDerivation](#overridekeyderivation)
* [overrideSaltGeneration](#overridesaltgeneration)
* [reset](#reset)
* [setDerivationRounds](#setderivationrounds)
* [use](#use)

### Constructors

####  constructor

\+ **new Configuration**(`options`: [ConfigurationOptions](#interfacesconfigurationoptionsmd)): *[Configuration](#classesconfigurationmd)*

*Defined in [base/Configuration.ts:28](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConfigurationOptions](#interfacesconfigurationoptionsmd) |

**Returns:** *[Configuration](#classesconfigurationmd)*

### Properties

####  _baseOptions

• **_baseOptions**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Defined in [base/Configuration.ts:34](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L34)*

___

####  _options

• **_options**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Defined in [base/Configuration.ts:35](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L35)*

### Accessors

####  options

• **get options**(): *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Defined in [base/Configuration.ts:42](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L42)*

Configuration options

**`memberof`** Configuration

**`readonly`** 

**Returns:** *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

### Methods

####  overrideDecryption

▸ **overrideDecryption**(`method`: [EncryptionType](#enumsencryptiontypemd), `func?`: [DecryptionFunction](#interfacesdecryptionfunctionmd)): *this*

*Defined in [base/Configuration.ts:58](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L58)*

Override the decryption method

**`memberof`** Configuration

**`example`** 
 config.overrideDecryption("cbc", (encryptedComponents, keyDerivationInfo) => {
   // handle decryption
   // return Promise
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | Which encryption type to override (cbc/gcm) |
`func?` | [DecryptionFunction](#interfacesdecryptionfunctionmd) | A decryption function that should resemble that in the example |

**Returns:** *this*

Returns self

___

####  overrideEncryption

▸ **overrideEncryption**(`method`: [EncryptionType](#enumsencryptiontypemd), `func?`: [EncryptionFunction](#interfacesencryptionfunctionmd)): *this*

*Defined in [base/Configuration.ts:76](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L76)*

Override the encryption method

**`memberof`** Configuration

**`example`** 
 config.overrideEncryption("cbc", (text, keyDerivationInfo, ivBuffer) => {
   // handle encryption
   // return Promise
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | Which encryption type to override (cbc/gcm) |
`func?` | [EncryptionFunction](#interfacesencryptionfunctionmd) | A encryption function that should resemble that in the example |

**Returns:** *this*

Returns self

___

####  overrideIVGeneration

▸ **overrideIVGeneration**(`func?`: [IVGenerationFunction](#interfacesivgenerationfunctionmd)): *this*

*Defined in [base/Configuration.ts:92](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L92)*

Override the IV generator

**`memberof`** Configuration

**`example`** 
 config.overrideIVGeneration(() => {
   return Promise.resolve(ivBuffer);
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func?` | [IVGenerationFunction](#interfacesivgenerationfunctionmd) | The override function |

**Returns:** *this*

Returns self

___

####  overrideKeyDerivation

▸ **overrideKeyDerivation**(`func?`: [KeyDerivationFunction](#interfaceskeyderivationfunctionmd)): *this*

*Defined in [base/Configuration.ts:108](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L108)*

Override key derivation
Derive the key according to the `pbkdf2` function in derivation.js

**`memberof`** Configuration

**`example`** 
 config.overrideKeyDerivation((password, salt, rounds, bits) => {
   return Promise.resolve(derivedKeyBuffer);
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func?` | [KeyDerivationFunction](#interfaceskeyderivationfunctionmd) | The new key derivation function |

**Returns:** *this*

Returns self

___

####  overrideSaltGeneration

▸ **overrideSaltGeneration**(`func?`: [SaltGenerationFunction](#interfacessaltgenerationfunctionmd)): *this*

*Defined in [base/Configuration.ts:123](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L123)*

Override salt generation

**`memberof`** Configuration

**`example`** 
 config.overrideSaltGeneration(length => {
   return Promise.resolve(saltText);
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func?` | [SaltGenerationFunction](#interfacessaltgenerationfunctionmd) | The function to use for salt generation |

**Returns:** *this*

Returns self

___

####  reset

▸ **reset**(): *this*

*Defined in [base/Configuration.ts:133](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L133)*

Reset the configuration options

**`memberof`** Configuration

**Returns:** *this*

Returns self

___

####  setDerivationRounds

▸ **setDerivationRounds**(`rounds?`: number): *this*

*Defined in [base/Configuration.ts:146](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L146)*

Set the derivation rounds to use

**`memberof`** Configuration

**`example`** 
 config.setDerivationRounds(250000);

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rounds?` | number | The new rounds to use (empty for reset) |

**Returns:** *this*

Returns self

___

####  use

▸ **use**(`method`: [EncryptionType](#enumsencryptiontypemd)): *this*

*Defined in [base/Configuration.ts:163](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L163)*

Set the encryption method to use

**`memberof`** Configuration

**`example`** 
 config.use("gcm");

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | The method to use (cbc/gcm) |

**Returns:** *this*

Returns self


<a name="classessessionmd"></a>

[iocane](#readmemd) › [Session](#classessessionmd)

## Class: Session

Encryption session

### Hierarchy

* [Configuration](#classesconfigurationmd)

  ↳ **Session**

### Index

#### Constructors

* [constructor](#constructor)

#### Properties

* [_baseOptions](#_baseoptions)
* [_options](#_options)

#### Accessors

* [options](#options)

#### Methods

* [_deriveKey](#protected-_derivekey)
* [_deriveNewKey](#protected-_derivenewkey)
* [decrypt](#decrypt)
* [encrypt](#encrypt)
* [overrideDecryption](#overridedecryption)
* [overrideEncryption](#overrideencryption)
* [overrideIVGeneration](#overrideivgeneration)
* [overrideKeyDerivation](#overridekeyderivation)
* [overrideSaltGeneration](#overridesaltgeneration)
* [reset](#reset)
* [setDerivationRounds](#setderivationrounds)
* [use](#use)

### Constructors

####  constructor

\+ **new Session**(`options`: [ConfigurationOptions](#interfacesconfigurationoptionsmd)): *[Session](#classessessionmd)*

*Inherited from [Configuration](#classesconfigurationmd).[constructor](#constructor)*

*Defined in [base/Configuration.ts:28](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConfigurationOptions](#interfacesconfigurationoptionsmd) |

**Returns:** *[Session](#classessessionmd)*

### Properties

####  _baseOptions

• **_baseOptions**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Inherited from [Configuration](#classesconfigurationmd).[_baseOptions](#_baseoptions)*

*Defined in [base/Configuration.ts:34](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L34)*

___

####  _options

• **_options**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Inherited from [Configuration](#classesconfigurationmd).[_options](#_options)*

*Defined in [base/Configuration.ts:35](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L35)*

### Accessors

####  options

• **get options**(): *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Inherited from [Configuration](#classesconfigurationmd).[options](#options)*

*Defined in [base/Configuration.ts:42](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L42)*

Configuration options

**`memberof`** Configuration

**`readonly`** 

**Returns:** *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

### Methods

#### `Protected` _deriveKey

▸ **_deriveKey**(`password`: string, `salt`: string, `rounds?`: number, `encryptionMethod?`: [EncryptionType](#enumsencryptiontypemd)): *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

*Defined in [base/Session.ts:68](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Session.ts#L68)*

Derive a key using the current configuration

**`memberof`** Session

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`password` | string | The password |
`salt` | string | The salt |
`rounds?` | number | Key derivation rounds |
`encryptionMethod?` | [EncryptionType](#enumsencryptiontypemd) | Encryption method |

**Returns:** *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

Derived key information

___

#### `Protected` _deriveNewKey

▸ **_deriveNewKey**(`password`: string): *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

*Defined in [base/Session.ts:98](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Session.ts#L98)*

Derive a new key using the current configuration

**`memberof`** Session

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`password` | string | The password |

**Returns:** *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

Derived key information

___

####  decrypt

▸ **decrypt**(`content`: string | Buffer | ArrayBuffer, `password`: string): *Promise‹string | Buffer | ArrayBuffer›*

*Defined in [base/Session.ts:21](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Session.ts#L21)*

Decrypt some text or data

**`memberof`** Session

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`content` | string &#124; Buffer &#124; ArrayBuffer | The content to decrypt |
`password` | string | The password to use for decryption |

**Returns:** *Promise‹string | Buffer | ArrayBuffer›*

Decrypted content

___

####  encrypt

▸ **encrypt**(`content`: string | Buffer | ArrayBuffer, `password`: string): *Promise‹[PackedEncryptedText](#packedencryptedtext) | Buffer | ArrayBuffer›*

*Defined in [base/Session.ts:42](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Session.ts#L42)*

Encrypt some text or data

**`memberof`** Session

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`content` | string &#124; Buffer &#124; ArrayBuffer | The content to encrypt |
`password` | string | The password to use for encryption |

**Returns:** *Promise‹[PackedEncryptedText](#packedencryptedtext) | Buffer | ArrayBuffer›*

A promise that resolves with encrypted text or data

___

####  overrideDecryption

▸ **overrideDecryption**(`method`: [EncryptionType](#enumsencryptiontypemd), `func?`: [DecryptionFunction](#interfacesdecryptionfunctionmd)): *this*

*Inherited from [Configuration](#classesconfigurationmd).[overrideDecryption](#overridedecryption)*

*Defined in [base/Configuration.ts:58](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L58)*

Override the decryption method

**`memberof`** Configuration

**`example`** 
 config.overrideDecryption("cbc", (encryptedComponents, keyDerivationInfo) => {
   // handle decryption
   // return Promise
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | Which encryption type to override (cbc/gcm) |
`func?` | [DecryptionFunction](#interfacesdecryptionfunctionmd) | A decryption function that should resemble that in the example |

**Returns:** *this*

Returns self

___

####  overrideEncryption

▸ **overrideEncryption**(`method`: [EncryptionType](#enumsencryptiontypemd), `func?`: [EncryptionFunction](#interfacesencryptionfunctionmd)): *this*

*Inherited from [Configuration](#classesconfigurationmd).[overrideEncryption](#overrideencryption)*

*Defined in [base/Configuration.ts:76](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L76)*

Override the encryption method

**`memberof`** Configuration

**`example`** 
 config.overrideEncryption("cbc", (text, keyDerivationInfo, ivBuffer) => {
   // handle encryption
   // return Promise
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | Which encryption type to override (cbc/gcm) |
`func?` | [EncryptionFunction](#interfacesencryptionfunctionmd) | A encryption function that should resemble that in the example |

**Returns:** *this*

Returns self

___

####  overrideIVGeneration

▸ **overrideIVGeneration**(`func?`: [IVGenerationFunction](#interfacesivgenerationfunctionmd)): *this*

*Inherited from [Configuration](#classesconfigurationmd).[overrideIVGeneration](#overrideivgeneration)*

*Defined in [base/Configuration.ts:92](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L92)*

Override the IV generator

**`memberof`** Configuration

**`example`** 
 config.overrideIVGeneration(() => {
   return Promise.resolve(ivBuffer);
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func?` | [IVGenerationFunction](#interfacesivgenerationfunctionmd) | The override function |

**Returns:** *this*

Returns self

___

####  overrideKeyDerivation

▸ **overrideKeyDerivation**(`func?`: [KeyDerivationFunction](#interfaceskeyderivationfunctionmd)): *this*

*Inherited from [Configuration](#classesconfigurationmd).[overrideKeyDerivation](#overridekeyderivation)*

*Defined in [base/Configuration.ts:108](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L108)*

Override key derivation
Derive the key according to the `pbkdf2` function in derivation.js

**`memberof`** Configuration

**`example`** 
 config.overrideKeyDerivation((password, salt, rounds, bits) => {
   return Promise.resolve(derivedKeyBuffer);
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func?` | [KeyDerivationFunction](#interfaceskeyderivationfunctionmd) | The new key derivation function |

**Returns:** *this*

Returns self

___

####  overrideSaltGeneration

▸ **overrideSaltGeneration**(`func?`: [SaltGenerationFunction](#interfacessaltgenerationfunctionmd)): *this*

*Inherited from [Configuration](#classesconfigurationmd).[overrideSaltGeneration](#overridesaltgeneration)*

*Defined in [base/Configuration.ts:123](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L123)*

Override salt generation

**`memberof`** Configuration

**`example`** 
 config.overrideSaltGeneration(length => {
   return Promise.resolve(saltText);
 });

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`func?` | [SaltGenerationFunction](#interfacessaltgenerationfunctionmd) | The function to use for salt generation |

**Returns:** *this*

Returns self

___

####  reset

▸ **reset**(): *this*

*Inherited from [Configuration](#classesconfigurationmd).[reset](#reset)*

*Defined in [base/Configuration.ts:133](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L133)*

Reset the configuration options

**`memberof`** Configuration

**Returns:** *this*

Returns self

___

####  setDerivationRounds

▸ **setDerivationRounds**(`rounds?`: number): *this*

*Inherited from [Configuration](#classesconfigurationmd).[setDerivationRounds](#setderivationrounds)*

*Defined in [base/Configuration.ts:146](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L146)*

Set the derivation rounds to use

**`memberof`** Configuration

**`example`** 
 config.setDerivationRounds(250000);

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rounds?` | number | The new rounds to use (empty for reset) |

**Returns:** *this*

Returns self

___

####  use

▸ **use**(`method`: [EncryptionType](#enumsencryptiontypemd)): *this*

*Inherited from [Configuration](#classesconfigurationmd).[use](#use)*

*Defined in [base/Configuration.ts:163](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/Configuration.ts#L163)*

Set the encryption method to use

**`memberof`** Configuration

**`example`** 
 config.use("gcm");

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | The method to use (cbc/gcm) |

**Returns:** *this*

Returns self

# Interfaces


<a name="interfacesconfigurationoptionsmd"></a>

[iocane](#readmemd) › [ConfigurationOptions](#interfacesconfigurationoptionsmd)

## Interface: ConfigurationOptions

### Hierarchy

* **ConfigurationOptions**

### Index

#### Properties

* [decryption_cbc](#decryption_cbc)
* [decryption_gcm](#decryption_gcm)
* [derivationRounds](#derivationrounds)
* [deriveKey](#derivekey)
* [encryption_cbc](#encryption_cbc)
* [encryption_gcm](#encryption_gcm)
* [generateIV](#generateiv)
* [generateSalt](#generatesalt)
* [method](#method)
* [pack_data](#pack_data)
* [pack_text](#pack_text)
* [pbkdf2](#pbkdf2)
* [saltLength](#saltlength)
* [unpack_data](#unpack_data)
* [unpack_text](#unpack_text)

### Properties

####  decryption_cbc

• **decryption_cbc**: *[DecryptionFunction](#interfacesdecryptionfunctionmd)*

*Defined in [base/constructs.ts:5](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L5)*

AES-CBC decryption function

___

####  decryption_gcm

• **decryption_gcm**: *[DecryptionFunction](#interfacesdecryptionfunctionmd)*

*Defined in [base/constructs.ts:9](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L9)*

AES-GCM decryption function

___

####  derivationRounds

• **derivationRounds**: *number*

*Defined in [base/constructs.ts:13](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L13)*

Default number of key derivation iterations

___

####  deriveKey

• **deriveKey**: *[KeyDerivationFunction](#interfaceskeyderivationfunctionmd)*

*Defined in [base/constructs.ts:17](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L17)*

Key derivation helper/wrapper function

___

####  encryption_cbc

• **encryption_cbc**: *[EncryptionFunction](#interfacesencryptionfunctionmd)*

*Defined in [base/constructs.ts:21](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L21)*

AES-CBC encryption function

___

####  encryption_gcm

• **encryption_gcm**: *[EncryptionFunction](#interfacesencryptionfunctionmd)*

*Defined in [base/constructs.ts:25](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L25)*

AES-GCM encryption function

___

####  generateIV

• **generateIV**: *[IVGenerationFunction](#interfacesivgenerationfunctionmd)*

*Defined in [base/constructs.ts:29](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L29)*

Random IV generation function

___

####  generateSalt

• **generateSalt**: *[SaltGenerationFunction](#interfacessaltgenerationfunctionmd)*

*Defined in [base/constructs.ts:33](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L33)*

Random salt generation function

___

####  method

• **method**: *[EncryptionType](#enumsencryptiontypemd)*

*Defined in [base/constructs.ts:37](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L37)*

The encryption method - cbc/gcm

___

####  pack_data

• **pack_data**: *[PackDataFunction](#interfacespackdatafunctionmd)*

*Defined in [base/constructs.ts:41](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L41)*

The data packing method

___

####  pack_text

• **pack_text**: *[PackTextFunction](#interfacespacktextfunctionmd)*

*Defined in [base/constructs.ts:45](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L45)*

The text packing method

___

####  pbkdf2

• **pbkdf2**: *[PBKDF2Function](#interfacespbkdf2functionmd)*

*Defined in [base/constructs.ts:49](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L49)*

PBKDF2 derivation function

___

####  saltLength

• **saltLength**: *number*

*Defined in [base/constructs.ts:53](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L53)*

Salt character length

___

####  unpack_data

• **unpack_data**: *[UnpackDataFunction](#interfacesunpackdatafunctionmd)*

*Defined in [base/constructs.ts:57](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L57)*

The data unpacking method

___

####  unpack_text

• **unpack_text**: *[UnpackTextFunction](#interfacesunpacktextfunctionmd)*

*Defined in [base/constructs.ts:61](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L61)*

The text unpacking method


<a name="interfacesdecryptionfunctionmd"></a>

[iocane](#readmemd) › [DecryptionFunction](#interfacesdecryptionfunctionmd)

## Interface: DecryptionFunction

Decryption function that takes encrypted components and key derivation
data and returns a decrypted string asynchronously

### Hierarchy

* **DecryptionFunction**

### Callable

▸ (`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd) | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd), `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd)): *Promise‹string | Buffer | ArrayBuffer›*

*Defined in [base/constructs.ts:68](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L68)*

Decryption function that takes encrypted components and key derivation
data and returns a decrypted string asynchronously

**Parameters:**

Name | Type |
------ | ------ |
`encryptedComponents` | [EncryptedComponents](#interfacesencryptedcomponentsmd) &#124; [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd) |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) |

**Returns:** *Promise‹string | Buffer | ArrayBuffer›*


<a name="interfacesderivedkeyinfomd"></a>

[iocane](#readmemd) › [DerivedKeyInfo](#interfacesderivedkeyinfomd)

## Interface: DerivedKeyInfo

### Hierarchy

* **DerivedKeyInfo**

### Index

#### Properties

* [hmac](#hmac)
* [key](#key)
* [rounds](#rounds)
* [salt](#salt)

### Properties

####  hmac

• **hmac**: *Buffer | ArrayBuffer | null*

*Defined in [base/constructs.ts:78](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L78)*

___

####  key

• **key**: *Buffer | ArrayBuffer*

*Defined in [base/constructs.ts:77](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L77)*

___

####  rounds

• **rounds**: *number*

*Defined in [base/constructs.ts:79](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L79)*

___

####  salt

• **salt**: *string*

*Defined in [base/constructs.ts:76](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L76)*


<a name="interfacesencryptedbinarycomponentsmd"></a>

[iocane](#readmemd) › [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)

## Interface: EncryptedBinaryComponents

### Hierarchy

* **EncryptedBinaryComponents**

### Index

#### Properties

* [auth](#auth)
* [content](#content)
* [iv](#iv)
* [method](#method)
* [rounds](#rounds)
* [salt](#salt)

### Properties

####  auth

• **auth**: *string*

*Defined in [base/constructs.ts:95](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L95)*

___

####  content

• **content**: *Buffer | ArrayBuffer*

*Defined in [base/constructs.ts:92](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L92)*

___

####  iv

• **iv**: *string*

*Defined in [base/constructs.ts:93](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L93)*

___

####  method

• **method**: *[EncryptionType](#enumsencryptiontypemd)*

*Defined in [base/constructs.ts:97](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L97)*

___

####  rounds

• **rounds**: *number*

*Defined in [base/constructs.ts:96](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L96)*

___

####  salt

• **salt**: *string*

*Defined in [base/constructs.ts:94](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L94)*


<a name="interfacesencryptedcomponentsmd"></a>

[iocane](#readmemd) › [EncryptedComponents](#interfacesencryptedcomponentsmd)

## Interface: EncryptedComponents

### Hierarchy

* **EncryptedComponents**

### Index

#### Properties

* [auth](#auth)
* [content](#content)
* [iv](#iv)
* [method](#method)
* [rounds](#rounds)
* [salt](#salt)

### Properties

####  auth

• **auth**: *string*

*Defined in [base/constructs.ts:86](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L86)*

___

####  content

• **content**: *string*

*Defined in [base/constructs.ts:83](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L83)*

___

####  iv

• **iv**: *string*

*Defined in [base/constructs.ts:84](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L84)*

___

####  method

• **method**: *[EncryptionType](#enumsencryptiontypemd)*

*Defined in [base/constructs.ts:88](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L88)*

___

####  rounds

• **rounds**: *number*

*Defined in [base/constructs.ts:87](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L87)*

___

####  salt

• **salt**: *string*

*Defined in [base/constructs.ts:85](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L85)*


<a name="interfacesencryptionfunctionmd"></a>

[iocane](#readmemd) › [EncryptionFunction](#interfacesencryptionfunctionmd)

## Interface: EncryptionFunction

Encryption function that takes a raw string, key derivation data and
an IV buffer. Returns an encrypted components payload, ready for
packing.

### Hierarchy

* **EncryptionFunction**

### Callable

▸ (`content`: string | Buffer | ArrayBuffer, `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd), `iv`: Buffer | ArrayBuffer): *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd) | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)›*

*Defined in [base/constructs.ts:105](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L105)*

Encryption function that takes a raw string, key derivation data and
an IV buffer. Returns an encrypted components payload, ready for
packing.

**Parameters:**

Name | Type |
------ | ------ |
`content` | string &#124; Buffer &#124; ArrayBuffer |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) |
`iv` | Buffer &#124; ArrayBuffer |

**Returns:** *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd) | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)›*


<a name="interfacesivgenerationfunctionmd"></a>

[iocane](#readmemd) › [IVGenerationFunction](#interfacesivgenerationfunctionmd)

## Interface: IVGenerationFunction

Random IV generation function - returns an IV buffer aynchronously

### Hierarchy

* **IVGenerationFunction**

### Callable

▸ (): *Promise‹Buffer | ArrayBuffer›*

*Defined in [base/constructs.ts:125](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L125)*

Random IV generation function - returns an IV buffer aynchronously

**Returns:** *Promise‹Buffer | ArrayBuffer›*


<a name="interfaceskeyderivationfunctionmd"></a>

[iocane](#readmemd) › [KeyDerivationFunction](#interfaceskeyderivationfunctionmd)

## Interface: KeyDerivationFunction

Key derivation helper - wraps a key derivation method and produces
derived-key information that can be provided to several functions.

### Hierarchy

* **KeyDerivationFunction**

### Callable

▸ (`deriveKey`: [PBKDF2Function](#interfacespbkdf2functionmd), `password`: string, `salt`: string, `rounds`: number, `generateHMAC?`: boolean): *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

*Defined in [base/constructs.ts:133](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L133)*

Key derivation helper - wraps a key derivation method and produces
derived-key information that can be provided to several functions.

**Parameters:**

Name | Type |
------ | ------ |
`deriveKey` | [PBKDF2Function](#interfacespbkdf2functionmd) |
`password` | string |
`salt` | string |
`rounds` | number |
`generateHMAC?` | boolean |

**Returns:** *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*


<a name="interfacespackdatafunctionmd"></a>

[iocane](#readmemd) › [PackDataFunction](#interfacespackdatafunctionmd)

## Interface: PackDataFunction

Encrypted text packing method - packs components into a single
string.

### Hierarchy

* **PackDataFunction**

### Callable

▸ (`components`: [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)): *Buffer | ArrayBuffer*

*Defined in [base/constructs.ts:153](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L153)*

Encrypted text packing method - packs components into a single
string.

**Parameters:**

Name | Type |
------ | ------ |
`components` | [EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd) |

**Returns:** *Buffer | ArrayBuffer*


<a name="interfacespacktextfunctionmd"></a>

[iocane](#readmemd) › [PackTextFunction](#interfacespacktextfunctionmd)

## Interface: PackTextFunction

Encrypted text packing method - packs components into a single
string.

### Hierarchy

* **PackTextFunction**

### Callable

▸ (`components`: [EncryptedComponents](#interfacesencryptedcomponentsmd)): *[PackedEncryptedText](#packedencryptedtext)*

*Defined in [base/constructs.ts:161](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L161)*

Encrypted text packing method - packs components into a single
string.

**Parameters:**

Name | Type |
------ | ------ |
`components` | [EncryptedComponents](#interfacesencryptedcomponentsmd) |

**Returns:** *[PackedEncryptedText](#packedencryptedtext)*


<a name="interfacespbkdf2functionmd"></a>

[iocane](#readmemd) › [PBKDF2Function](#interfacespbkdf2functionmd)

## Interface: PBKDF2Function

Key derivation method - returns a buffer, asynchronously, that matches
the specified number of bits (in hex form). Takes a raw password,
random salt, number of derivation rounds/iterations and the bits of
key to generate.

### Hierarchy

* **PBKDF2Function**

### Callable

▸ (`password`: string, `salt`: string, `rounds`: number, `bits`: number): *Promise‹Buffer | ArrayBuffer›*

*Defined in [base/constructs.ts:171](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L171)*

Key derivation method - returns a buffer, asynchronously, that matches
the specified number of bits (in hex form). Takes a raw password,
random salt, number of derivation rounds/iterations and the bits of
key to generate.

**Parameters:**

Name | Type |
------ | ------ |
`password` | string |
`salt` | string |
`rounds` | number |
`bits` | number |

**Returns:** *Promise‹Buffer | ArrayBuffer›*


<a name="interfacessaltgenerationfunctionmd"></a>

[iocane](#readmemd) › [SaltGenerationFunction](#interfacessaltgenerationfunctionmd)

## Interface: SaltGenerationFunction

Salt generation function - takes a string length as the only parameter
and returns a random salt string asynchronously.

### Hierarchy

* **SaltGenerationFunction**

### Callable

▸ (`length`: number): *Promise‹string›*

*Defined in [base/constructs.ts:179](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L179)*

Salt generation function - takes a string length as the only parameter
and returns a random salt string asynchronously.

**Parameters:**

Name | Type |
------ | ------ |
`length` | number |

**Returns:** *Promise‹string›*


<a name="interfacesunpackdatafunctionmd"></a>

[iocane](#readmemd) › [UnpackDataFunction](#interfacesunpackdatafunctionmd)

## Interface: UnpackDataFunction

Encrypted data unpacking method - unpacks a buffer into a group of
encryption components.

### Hierarchy

* **UnpackDataFunction**

### Callable

▸ (`packed`: Buffer | ArrayBuffer): *[EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)*

*Defined in [base/constructs.ts:187](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L187)*

Encrypted data unpacking method - unpacks a buffer into a group of
encryption components.

**Parameters:**

Name | Type |
------ | ------ |
`packed` | Buffer &#124; ArrayBuffer |

**Returns:** *[EncryptedBinaryComponents](#interfacesencryptedbinarycomponentsmd)*


<a name="interfacesunpacktextfunctionmd"></a>

[iocane](#readmemd) › [UnpackTextFunction](#interfacesunpacktextfunctionmd)

## Interface: UnpackTextFunction

Encrypted text unpacking method - unpacks a string into a group of
encryption components.

### Hierarchy

* **UnpackTextFunction**

### Callable

▸ (`packed`: [PackedEncryptedText](#packedencryptedtext)): *[EncryptedComponents](#interfacesencryptedcomponentsmd)*

*Defined in [base/constructs.ts:195](https://github.com/perry-mitchell/iocane/blob/e064790/source/base/constructs.ts#L195)*

Encrypted text unpacking method - unpacks a string into a group of
encryption components.

**Parameters:**

Name | Type |
------ | ------ |
`packed` | [PackedEncryptedText](#packedencryptedtext) |

**Returns:** *[EncryptedComponents](#interfacesencryptedcomponentsmd)*
