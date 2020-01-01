
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
* [EncryptedComponents](#interfacesencryptedcomponentsmd)
* [EncryptionFunction](#interfacesencryptionfunctionmd)
* [IVGenerationFunction](#interfacesivgenerationfunctionmd)
* [KeyDerivationFunction](#interfaceskeyderivationfunctionmd)
* [PBKDF2Function](#interfacespbkdf2functionmd)
* [SaltGenerationFunction](#interfacessaltgenerationfunctionmd)

### Type aliases

* [PackedEncryptedContent](#packedencryptedcontent)

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
* [getDefaultOptions](#getdefaultoptions)
* [packEncryptedContent](#packencryptedcontent)
* [pbkdf2](#pbkdf2)
* [unpackEncryptedContent](#unpackencryptedcontent)
* [validateEncryptionMethod](#validateencryptionmethod)

## Type aliases

###  PackedEncryptedContent

Ƭ **PackedEncryptedContent**: *string*

*Defined in [base/constructs.ts:125](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L125)*

An encrypted string payload, containing all necessary data for
decryption to occur (besides the password).

## Variables

### `Const` ALGO_DEFAULT

• **ALGO_DEFAULT**: *[CBC](#cbc)* =  EncryptionType.CBC

*Defined in [base/shared.ts:3](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/shared.ts#L3)*

___

### `Const` DERIVED_KEY_ALGORITHM

• **DERIVED_KEY_ALGORITHM**: *"sha256"* = "sha256"

*Defined in [node/derivation.ts:4](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/derivation.ts#L4)*

___

### `Const` DERIVED_KEY_ITERATIONS

• **DERIVED_KEY_ITERATIONS**: *250000* = 250000

*Defined in [base/shared.ts:4](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/shared.ts#L4)*

___

### `Const` ENC_ALGORITHM_CBC

• **ENC_ALGORITHM_CBC**: *"aes-256-cbc"* = "aes-256-cbc"

*Defined in [node/encryption.ts:5](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/encryption.ts#L5)*

___

### `Const` ENC_ALGORITHM_GCM

• **ENC_ALGORITHM_GCM**: *"aes-256-gcm"* = "aes-256-gcm"

*Defined in [node/encryption.ts:6](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/encryption.ts#L6)*

___

### `Const` HMAC_ALGORITHM

• **HMAC_ALGORITHM**: *"sha256"* = "sha256"

*Defined in [node/encryption.ts:7](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/encryption.ts#L7)*

___

### `Const` HMAC_KEY_SIZE

• **HMAC_KEY_SIZE**: *32* = 32

*Defined in [node/derivation.ts:5](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/derivation.ts#L5)*

___

### `Const` METHODS

• **METHODS**: *[EncryptionType](#enumsencryptiontypemd)[]* =  [EncryptionType.CBC, EncryptionType.GCM]

*Defined in [base/Configuration.ts:12](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L12)*

___

### `Const` PASSWORD_KEY_SIZE

• **PASSWORD_KEY_SIZE**: *32* = 32

*Defined in [node/derivation.ts:6](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/derivation.ts#L6)*

___

### `Const` PBKDF2_ROUND_DEFAULT

• **PBKDF2_ROUND_DEFAULT**: *1000* = 1000

*Defined in [base/packing.ts:4](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/packing.ts#L4)*

___

### `Const` SALT_LENGTH

• **SALT_LENGTH**: *12* = 12

*Defined in [node/defaults.ts:13](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/defaults.ts#L13)*

## Functions

###  constantTimeCompare

▸ **constantTimeCompare**(`val1`: string, `val2`: string): *boolean*

*Defined in [base/timing.ts:7](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/timing.ts#L7)*

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

*Defined in [index.node.ts:13](https://github.com/perry-mitchell/iocane/blob/6058545/source/index.node.ts#L13)*

Start new encryption/decryption session

**`memberof`** module:iocane

**Returns:** *[Session](#classessessionmd)*

New crypto session

___

###  decryptCBC

▸ **decryptCBC**(`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd), `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd)): *Promise‹string›*

*Defined in [node/encryption.ts:15](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/encryption.ts#L15)*

Decrypt text using AES-CBC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`encryptedComponents` | [EncryptedComponents](#interfacesencryptedcomponentsmd) | Encrypted components |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) | Key derivation information |

**Returns:** *Promise‹string›*

A promise that resolves with the decrypted string

___

###  decryptGCM

▸ **decryptGCM**(`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd), `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd)): *Promise‹string›*

*Defined in [node/encryption.ts:51](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/encryption.ts#L51)*

Decrypt text using AES-GCM

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`encryptedComponents` | [EncryptedComponents](#interfacesencryptedcomponentsmd) | Encrypted components |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) | Key derivation information |

**Returns:** *Promise‹string›*

A promise that resolves with the decrypted string

___

###  deriveFromPassword

▸ **deriveFromPassword**(`pbkdf2Gen`: [PBKDF2Function](#interfacespbkdf2functionmd), `password`: string, `salt`: string, `rounds`: number, `generateHMAC`: boolean): *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

*Defined in [node/derivation.ts:20](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/derivation.ts#L20)*

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

▸ **encryptCBC**(`text`: string, `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd), `iv`: Buffer): *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd)›*

*Defined in [node/encryption.ts:81](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/encryption.ts#L81)*

Encrypt text using AES-CBC

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`text` | string | The text to encrypt |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) | Key derivation information |
`iv` | Buffer | A buffer containing the IV |

**Returns:** *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd)›*

A promise that resolves with encrypted components

___

###  encryptGCM

▸ **encryptGCM**(`text`: string, `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd), `iv`: Buffer): *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd)›*

*Defined in [node/encryption.ts:120](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/encryption.ts#L120)*

Encrypt text using AES-GCM

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`text` | string | The text to encrypt |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) | Key derivation information |
`iv` | Buffer | A buffer containing the IV |

**Returns:** *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd)›*

A promise that resolves with encrypted components

___

###  generateIV

▸ **generateIV**(): *Promise‹Buffer›*

*Defined in [node/encryption.ts:154](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/encryption.ts#L154)*

IV generator

**Returns:** *Promise‹Buffer›*

A newly generated IV

___

###  generateSalt

▸ **generateSalt**(`length`: number): *Promise‹string›*

*Defined in [node/encryption.ts:164](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/encryption.ts#L164)*

Generate a random salt

**`throws`** {Error} Rejects if length is invalid

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`length` | number | The length of the string to generate |

**Returns:** *Promise‹string›*

A promise that resolves with a salt (hex)

___

###  getDefaultOptions

▸ **getDefaultOptions**(): *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Defined in [node/defaults.ts:19](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/defaults.ts#L19)*

Get the default options

**Returns:** *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

Default configuration options

___

###  packEncryptedContent

▸ **packEncryptedContent**(`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd)): *[PackedEncryptedContent](#packedencryptedcontent)*

*Defined in [base/packing.ts:11](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/packing.ts#L11)*

Pack encrypted content components into the final encrypted form

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`encryptedComponents` | [EncryptedComponents](#interfacesencryptedcomponentsmd) | The encrypted components payload |

**Returns:** *[PackedEncryptedContent](#packedencryptedcontent)*

The final encrypted form

___

###  pbkdf2

▸ **pbkdf2**(`password`: string, `salt`: string, `rounds`: number, `bits`: number): *Promise‹Buffer›*

*Defined in [node/derivation.ts:61](https://github.com/perry-mitchell/iocane/blob/6058545/source/node/derivation.ts#L61)*

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

###  unpackEncryptedContent

▸ **unpackEncryptedContent**(`encryptedContent`: [PackedEncryptedContent](#packedencryptedcontent)): *[EncryptedComponents](#interfacesencryptedcomponentsmd)*

*Defined in [base/packing.ts:24](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/packing.ts#L24)*

Unpack encrypted content components from an encrypted string

**`throws`** {Error} Throws if the number of components is incorrect

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`encryptedContent` | [PackedEncryptedContent](#packedencryptedcontent) | The encrypted string |

**Returns:** *[EncryptedComponents](#interfacesencryptedcomponentsmd)*

The extracted components

___

###  validateEncryptionMethod

▸ **validateEncryptionMethod**(`method`: [EncryptionType](#enumsencryptiontypemd)): *void*

*Defined in [base/Configuration.ts:19](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L19)*

Validate an encryption method specification

**`throws`** {Error} Throws if the method is not valid

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | The method to validate |

**Returns:** *void*

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

*Defined in [base/Configuration.ts:28](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConfigurationOptions](#interfacesconfigurationoptionsmd) |

**Returns:** *[Configuration](#classesconfigurationmd)*

### Properties

####  _baseOptions

• **_baseOptions**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Defined in [base/Configuration.ts:34](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L34)*

___

####  _options

• **_options**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Defined in [base/Configuration.ts:35](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L35)*

### Accessors

####  options

• **get options**(): *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Defined in [base/Configuration.ts:42](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L42)*

Configuration options

**`memberof`** Configuration

**`readonly`** 

**Returns:** *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

### Methods

####  overrideDecryption

▸ **overrideDecryption**(`method`: [EncryptionType](#enumsencryptiontypemd), `func?`: [DecryptionFunction](#interfacesdecryptionfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Defined in [base/Configuration.ts:58](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L58)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  overrideEncryption

▸ **overrideEncryption**(`method`: [EncryptionType](#enumsencryptiontypemd), `func?`: [EncryptionFunction](#interfacesencryptionfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Defined in [base/Configuration.ts:76](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L76)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  overrideIVGeneration

▸ **overrideIVGeneration**(`func?`: [IVGenerationFunction](#interfacesivgenerationfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Defined in [base/Configuration.ts:92](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L92)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  overrideKeyDerivation

▸ **overrideKeyDerivation**(`func?`: [KeyDerivationFunction](#interfaceskeyderivationfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Defined in [base/Configuration.ts:108](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L108)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  overrideSaltGeneration

▸ **overrideSaltGeneration**(`func?`: [SaltGenerationFunction](#interfacessaltgenerationfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Defined in [base/Configuration.ts:123](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L123)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  reset

▸ **reset**(): *[Configuration](#classesconfigurationmd)*

*Defined in [base/Configuration.ts:133](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L133)*

Reset the configuration options

**`memberof`** Configuration

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  setDerivationRounds

▸ **setDerivationRounds**(`rounds?`: number): *[Configuration](#classesconfigurationmd)*

*Defined in [base/Configuration.ts:146](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L146)*

Set the derivation rounds to use

**`memberof`** Configuration

**`example`** 
 config.setDerivationRounds(250000);

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rounds?` | number | The new rounds to use (empty for reset) |

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  use

▸ **use**(`method`: [EncryptionType](#enumsencryptiontypemd)): *[Configuration](#classesconfigurationmd)*

*Defined in [base/Configuration.ts:163](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L163)*

Set the encryption method to use

**`memberof`** Configuration

**`example`** 
 config.use("gcm");

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | The method to use (cbc/gcm) |

**Returns:** *[Configuration](#classesconfigurationmd)*

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

*Defined in [base/Configuration.ts:28](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [ConfigurationOptions](#interfacesconfigurationoptionsmd) |

**Returns:** *[Session](#classessessionmd)*

### Properties

####  _baseOptions

• **_baseOptions**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Inherited from [Configuration](#classesconfigurationmd).[_baseOptions](#_baseoptions)*

*Defined in [base/Configuration.ts:34](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L34)*

___

####  _options

• **_options**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Inherited from [Configuration](#classesconfigurationmd).[_options](#_options)*

*Defined in [base/Configuration.ts:35](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L35)*

### Accessors

####  options

• **get options**(): *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Inherited from [Configuration](#classesconfigurationmd).[options](#options)*

*Defined in [base/Configuration.ts:42](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L42)*

Configuration options

**`memberof`** Configuration

**`readonly`** 

**Returns:** *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

### Methods

#### `Protected` _deriveKey

▸ **_deriveKey**(`password`: string, `salt`: string, `rounds?`: number, `encryptionMethod?`: [EncryptionType](#enumsencryptiontypemd)): *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

*Defined in [base/Session.ts:52](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Session.ts#L52)*

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

*Defined in [base/Session.ts:82](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Session.ts#L82)*

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

▸ **decrypt**(`text`: string, `password`: string): *Promise‹string›*

*Defined in [base/Session.ts:16](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Session.ts#L16)*

Decrypt some text

**`memberof`** Session

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`text` | string | The text to decrypt |
`password` | string | The password to use for decryption |

**Returns:** *Promise‹string›*

Decrypted text

___

####  encrypt

▸ **encrypt**(`text`: string, `password`: string): *Promise‹[PackedEncryptedContent](#packedencryptedcontent)›*

*Defined in [base/Session.ts:31](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Session.ts#L31)*

Encrypt some text

**`memberof`** Session

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`text` | string | The text to encrypt |
`password` | string | The password to use for encryption |

**Returns:** *Promise‹[PackedEncryptedContent](#packedencryptedcontent)›*

A promise that resolves with encrypted text

___

####  overrideDecryption

▸ **overrideDecryption**(`method`: [EncryptionType](#enumsencryptiontypemd), `func?`: [DecryptionFunction](#interfacesdecryptionfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Inherited from [Configuration](#classesconfigurationmd).[overrideDecryption](#overridedecryption)*

*Defined in [base/Configuration.ts:58](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L58)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  overrideEncryption

▸ **overrideEncryption**(`method`: [EncryptionType](#enumsencryptiontypemd), `func?`: [EncryptionFunction](#interfacesencryptionfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Inherited from [Configuration](#classesconfigurationmd).[overrideEncryption](#overrideencryption)*

*Defined in [base/Configuration.ts:76](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L76)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  overrideIVGeneration

▸ **overrideIVGeneration**(`func?`: [IVGenerationFunction](#interfacesivgenerationfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Inherited from [Configuration](#classesconfigurationmd).[overrideIVGeneration](#overrideivgeneration)*

*Defined in [base/Configuration.ts:92](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L92)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  overrideKeyDerivation

▸ **overrideKeyDerivation**(`func?`: [KeyDerivationFunction](#interfaceskeyderivationfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Inherited from [Configuration](#classesconfigurationmd).[overrideKeyDerivation](#overridekeyderivation)*

*Defined in [base/Configuration.ts:108](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L108)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  overrideSaltGeneration

▸ **overrideSaltGeneration**(`func?`: [SaltGenerationFunction](#interfacessaltgenerationfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Inherited from [Configuration](#classesconfigurationmd).[overrideSaltGeneration](#overridesaltgeneration)*

*Defined in [base/Configuration.ts:123](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L123)*

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

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  reset

▸ **reset**(): *[Configuration](#classesconfigurationmd)*

*Inherited from [Configuration](#classesconfigurationmd).[reset](#reset)*

*Defined in [base/Configuration.ts:133](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L133)*

Reset the configuration options

**`memberof`** Configuration

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  setDerivationRounds

▸ **setDerivationRounds**(`rounds?`: number): *[Configuration](#classesconfigurationmd)*

*Inherited from [Configuration](#classesconfigurationmd).[setDerivationRounds](#setderivationrounds)*

*Defined in [base/Configuration.ts:146](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L146)*

Set the derivation rounds to use

**`memberof`** Configuration

**`example`** 
 config.setDerivationRounds(250000);

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`rounds?` | number | The new rounds to use (empty for reset) |

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  use

▸ **use**(`method`: [EncryptionType](#enumsencryptiontypemd)): *[Configuration](#classesconfigurationmd)*

*Inherited from [Configuration](#classesconfigurationmd).[use](#use)*

*Defined in [base/Configuration.ts:163](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/Configuration.ts#L163)*

Set the encryption method to use

**`memberof`** Configuration

**`example`** 
 config.use("gcm");

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`method` | [EncryptionType](#enumsencryptiontypemd) | The method to use (cbc/gcm) |

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

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

*Defined in [base/constructs.ts:86](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L86)*

___

####  GCM

• **GCM**: = "gcm"

*Defined in [base/constructs.ts:87](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L87)*

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
* [pbkdf2](#pbkdf2)
* [saltLength](#saltlength)

### Properties

####  decryption_cbc

• **decryption_cbc**: *[DecryptionFunction](#interfacesdecryptionfunctionmd)*

*Defined in [base/constructs.ts:5](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L5)*

AES-CBC decryption function

___

####  decryption_gcm

• **decryption_gcm**: *[DecryptionFunction](#interfacesdecryptionfunctionmd)*

*Defined in [base/constructs.ts:9](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L9)*

AES-GCM decryption function

___

####  derivationRounds

• **derivationRounds**: *number*

*Defined in [base/constructs.ts:13](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L13)*

Default number of key derivation iterations

___

####  deriveKey

• **deriveKey**: *[KeyDerivationFunction](#interfaceskeyderivationfunctionmd)*

*Defined in [base/constructs.ts:17](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L17)*

Key derivation helper/wrapper function

___

####  encryption_cbc

• **encryption_cbc**: *[EncryptionFunction](#interfacesencryptionfunctionmd)*

*Defined in [base/constructs.ts:21](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L21)*

AES-CBC encryption function

___

####  encryption_gcm

• **encryption_gcm**: *[EncryptionFunction](#interfacesencryptionfunctionmd)*

*Defined in [base/constructs.ts:25](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L25)*

AES-GCM encryption function

___

####  generateIV

• **generateIV**: *[IVGenerationFunction](#interfacesivgenerationfunctionmd)*

*Defined in [base/constructs.ts:29](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L29)*

Random IV generation function

___

####  generateSalt

• **generateSalt**: *[SaltGenerationFunction](#interfacessaltgenerationfunctionmd)*

*Defined in [base/constructs.ts:33](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L33)*

Random salt generation function

___

####  method

• **method**: *[EncryptionType](#enumsencryptiontypemd)*

*Defined in [base/constructs.ts:37](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L37)*

The encryption method - cbc/gcm

___

####  pbkdf2

• **pbkdf2**: *[PBKDF2Function](#interfacespbkdf2functionmd)*

*Defined in [base/constructs.ts:41](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L41)*

PBKDF2 derivation function

___

####  saltLength

• **saltLength**: *number*

*Defined in [base/constructs.ts:45](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L45)*

Salt character length


<a name="interfacesdecryptionfunctionmd"></a>

[iocane](#readmemd) › [DecryptionFunction](#interfacesdecryptionfunctionmd)

## Interface: DecryptionFunction

Decryption function that takes encrypted components and key derivation
data and returns a decrypted string asynchronously

### Hierarchy

* **DecryptionFunction**

### Callable

▸ (`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd), `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd)): *Promise‹string›*

*Defined in [base/constructs.ts:52](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L52)*

Decryption function that takes encrypted components and key derivation
data and returns a decrypted string asynchronously

**Parameters:**

Name | Type |
------ | ------ |
`encryptedComponents` | [EncryptedComponents](#interfacesencryptedcomponentsmd) |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) |

**Returns:** *Promise‹string›*


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

*Defined in [base/constructs.ts:59](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L59)*

___

####  key

• **key**: *Buffer | ArrayBuffer*

*Defined in [base/constructs.ts:58](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L58)*

___

####  rounds

• **rounds**: *number*

*Defined in [base/constructs.ts:60](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L60)*

___

####  salt

• **salt**: *string*

*Defined in [base/constructs.ts:57](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L57)*


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

*Defined in [base/constructs.ts:67](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L67)*

___

####  content

• **content**: *string*

*Defined in [base/constructs.ts:64](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L64)*

___

####  iv

• **iv**: *string*

*Defined in [base/constructs.ts:65](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L65)*

___

####  method

• **method**: *[EncryptionType](#enumsencryptiontypemd)*

*Defined in [base/constructs.ts:69](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L69)*

___

####  rounds

• **rounds**: *number*

*Defined in [base/constructs.ts:68](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L68)*

___

####  salt

• **salt**: *string*

*Defined in [base/constructs.ts:66](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L66)*


<a name="interfacesencryptionfunctionmd"></a>

[iocane](#readmemd) › [EncryptionFunction](#interfacesencryptionfunctionmd)

## Interface: EncryptionFunction

Encryption function that takes a raw string, key derivation data and
an IV buffer. Returns an encrypted components payload, ready for
packing.

### Hierarchy

* **EncryptionFunction**

### Callable

▸ (`text`: string, `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd), `iv`: Buffer): *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd)›*

*Defined in [base/constructs.ts:77](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L77)*

Encryption function that takes a raw string, key derivation data and
an IV buffer. Returns an encrypted components payload, ready for
packing.

**Parameters:**

Name | Type |
------ | ------ |
`text` | string |
`keyDerivationInfo` | [DerivedKeyInfo](#interfacesderivedkeyinfomd) |
`iv` | Buffer |

**Returns:** *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd)›*


<a name="interfacesivgenerationfunctionmd"></a>

[iocane](#readmemd) › [IVGenerationFunction](#interfacesivgenerationfunctionmd)

## Interface: IVGenerationFunction

Random IV generation function - returns an IV buffer aynchronously

### Hierarchy

* **IVGenerationFunction**

### Callable

▸ (): *Promise‹Buffer | ArrayBuffer›*

*Defined in [base/constructs.ts:93](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L93)*

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

*Defined in [base/constructs.ts:101](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L101)*

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

*Defined in [base/constructs.ts:117](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L117)*

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

*Defined in [base/constructs.ts:131](https://github.com/perry-mitchell/iocane/blob/6058545/source/base/constructs.ts#L131)*

Salt generation function - takes a string length as the only parameter
and returns a random salt string asynchronously.

**Parameters:**

Name | Type |
------ | ------ |
`length` | number |

**Returns:** *Promise‹string›*
