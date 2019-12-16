
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

*Defined in [constructs.ts:64](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L64)*

An encrypted string payload, containing all necessary data for
decryption to occur (besides the password).

## Variables

### `Const` ALGO_DEFAULT

• **ALGO_DEFAULT**: *[CBC](#cbc)* =  EncryptionType.CBC

*Defined in [shared.ts:3](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/shared.ts#L3)*

___

### `Const` DERIVED_KEY_ALGORITHM

• **DERIVED_KEY_ALGORITHM**: *"sha256"* = "sha256"

*Defined in [derivation.ts:4](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/derivation.ts#L4)*

___

### `Const` DERIVED_KEY_ITERATIONS

• **DERIVED_KEY_ITERATIONS**: *250000* = 250000

*Defined in [Configuration.ts:63](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L63)*

___

### `Const` ENC_ALGORITHM_CBC

• **ENC_ALGORITHM_CBC**: *"aes-256-cbc"* = "aes-256-cbc"

*Defined in [encryption.ts:5](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/encryption.ts#L5)*

___

### `Const` ENC_ALGORITHM_GCM

• **ENC_ALGORITHM_GCM**: *"aes-256-gcm"* = "aes-256-gcm"

*Defined in [encryption.ts:6](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/encryption.ts#L6)*

___

### `Const` HMAC_ALGORITHM

• **HMAC_ALGORITHM**: *"sha256"* = "sha256"

*Defined in [encryption.ts:7](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/encryption.ts#L7)*

___

### `Const` HMAC_KEY_SIZE

• **HMAC_KEY_SIZE**: *32* = 32

*Defined in [derivation.ts:5](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/derivation.ts#L5)*

___

### `Const` METHODS

• **METHODS**: *[EncryptionType](#enumsencryptiontypemd)[]* =  [EncryptionType.CBC, EncryptionType.GCM]

*Defined in [Configuration.ts:64](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L64)*

___

### `Const` PASSWORD_KEY_SIZE

• **PASSWORD_KEY_SIZE**: *32* = 32

*Defined in [derivation.ts:6](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/derivation.ts#L6)*

___

### `Const` PBKDF2_ROUND_DEFAULT

• **PBKDF2_ROUND_DEFAULT**: *1000* = 1000

*Defined in [packing.ts:4](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/packing.ts#L4)*

___

### `Const` SALT_LENGTH

• **SALT_LENGTH**: *12* = 12

*Defined in [Configuration.ts:65](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L65)*

## Functions

###  constantTimeCompare

▸ **constantTimeCompare**(`val1`: string, `val2`: string): *boolean*

*Defined in [timing.ts:7](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/timing.ts#L7)*

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

*Defined in [index.ts:12](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/index.ts#L12)*

Start new encryption/decryption session

**`memberof`** module:iocane

**Returns:** *[Session](#classessessionmd)*

New crypto session

___

###  decryptCBC

▸ **decryptCBC**(`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd), `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd)): *Promise‹string›*

*Defined in [encryption.ts:15](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/encryption.ts#L15)*

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

*Defined in [encryption.ts:47](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/encryption.ts#L47)*

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

▸ **deriveFromPassword**(`pbkdf2Gen`: Function, `password`: string, `salt`: string, `rounds`: number, `generateHMAC`: boolean): *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

*Defined in [derivation.ts:29](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/derivation.ts#L29)*

Derive a key from a password

**`throws`** {Error} Rejects if no password is provided

**`throws`** {Error} Rejects if no salt is provided

**`throws`** {Error} Rejects if no rounds are provided

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`pbkdf2Gen` | Function | - | The generator method |
`password` | string | - | The password to derive from |
`salt` | string | - | The salt |
`rounds` | number | - | The number of iterations |
`generateHMAC` | boolean | true | Enable HMAC key generation |

**Returns:** *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

A promise that resolves with derived key information

___

###  encryptCBC

▸ **encryptCBC**(`text`: string, `keyDerivationInfo`: [DerivedKeyInfo](#interfacesderivedkeyinfomd), `iv`: Buffer): *Promise‹[EncryptedComponents](#interfacesencryptedcomponentsmd)›*

*Defined in [encryption.ts:73](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/encryption.ts#L73)*

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

*Defined in [encryption.ts:108](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/encryption.ts#L108)*

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

*Defined in [encryption.ts:138](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/encryption.ts#L138)*

IV generator

**Returns:** *Promise‹Buffer›*

A newly generated IV

___

###  generateSalt

▸ **generateSalt**(`length`: number): *Promise‹string›*

*Defined in [encryption.ts:148](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/encryption.ts#L148)*

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

*Defined in [Configuration.ts:71](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L71)*

Get the default options

**Returns:** *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

Default configuration options

___

###  packEncryptedContent

▸ **packEncryptedContent**(`encryptedComponents`: [EncryptedComponents](#interfacesencryptedcomponentsmd)): *[PackedEncryptedContent](#packedencryptedcontent)*

*Defined in [packing.ts:11](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/packing.ts#L11)*

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

*Defined in [derivation.ts:70](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/derivation.ts#L70)*

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

*Defined in [packing.ts:24](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/packing.ts#L24)*

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

*Defined in [Configuration.ts:91](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L91)*

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

#### Properties

* [_options](#_options)
* [getDefaultOptions](#static-getdefaultoptions)

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

### Properties

####  _options

• **_options**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)* =  getDefaultOptions()

*Defined in [Configuration.ts:103](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L103)*

___

#### `Static` getDefaultOptions

▪ **getDefaultOptions**: *[getDefaultOptions](#getdefaultoptions)* =  getDefaultOptions

*Defined in [Configuration.ts:101](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L101)*

### Accessors

####  options

• **get options**(): *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Defined in [Configuration.ts:110](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L110)*

Configuration options

**`memberof`** Configuration

**`readonly`** 

**Returns:** *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

### Methods

####  overrideDecryption

▸ **overrideDecryption**(`method`: [EncryptionType](#enumsencryptiontypemd), `func?`: [DecryptionFunction](#interfacesdecryptionfunctionmd)): *[Configuration](#classesconfigurationmd)*

*Defined in [Configuration.ts:126](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L126)*

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

*Defined in [Configuration.ts:144](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L144)*

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

*Defined in [Configuration.ts:160](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L160)*

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

*Defined in [Configuration.ts:176](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L176)*

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

*Defined in [Configuration.ts:191](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L191)*

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

*Defined in [Configuration.ts:201](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L201)*

Reset the configuration options

**`memberof`** Configuration

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  setDerivationRounds

▸ **setDerivationRounds**(`rounds?`: number): *[Configuration](#classesconfigurationmd)*

*Defined in [Configuration.ts:214](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L214)*

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

*Defined in [Configuration.ts:231](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L231)*

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

#### Properties

* [_options](#_options)
* [getDefaultOptions](#static-getdefaultoptions)

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

### Properties

####  _options

• **_options**: *[ConfigurationOptions](#interfacesconfigurationoptionsmd)* =  getDefaultOptions()

*Inherited from [Configuration](#classesconfigurationmd).[_options](#_options)*

*Defined in [Configuration.ts:103](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L103)*

___

#### `Static` getDefaultOptions

▪ **getDefaultOptions**: *[getDefaultOptions](#getdefaultoptions)* =  getDefaultOptions

*Inherited from [Configuration](#classesconfigurationmd).[getDefaultOptions](#static-getdefaultoptions)*

*Defined in [Configuration.ts:101](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L101)*

### Accessors

####  options

• **get options**(): *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

*Inherited from [Configuration](#classesconfigurationmd).[options](#options)*

*Defined in [Configuration.ts:110](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L110)*

Configuration options

**`memberof`** Configuration

**`readonly`** 

**Returns:** *[ConfigurationOptions](#interfacesconfigurationoptionsmd)*

### Methods

#### `Protected` _deriveKey

▸ **_deriveKey**(`password`: string, `salt`: string, `rounds?`: number, `encryptionMethod?`: [EncryptionType](#enumsencryptiontypemd)): *Promise‹[DerivedKeyInfo](#interfacesderivedkeyinfomd)›*

*Defined in [Session.ts:53](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Session.ts#L53)*

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

*Defined in [Session.ts:82](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Session.ts#L82)*

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

*Defined in [Session.ts:17](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Session.ts#L17)*

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

*Defined in [Session.ts:32](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Session.ts#L32)*

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

*Defined in [Configuration.ts:126](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L126)*

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

*Defined in [Configuration.ts:144](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L144)*

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

*Defined in [Configuration.ts:160](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L160)*

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

*Defined in [Configuration.ts:176](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L176)*

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

*Defined in [Configuration.ts:191](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L191)*

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

*Defined in [Configuration.ts:201](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L201)*

Reset the configuration options

**`memberof`** Configuration

**Returns:** *[Configuration](#classesconfigurationmd)*

Returns self

___

####  setDerivationRounds

▸ **setDerivationRounds**(`rounds?`: number): *[Configuration](#classesconfigurationmd)*

*Inherited from [Configuration](#classesconfigurationmd).[setDerivationRounds](#setderivationrounds)*

*Defined in [Configuration.ts:214](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L214)*

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

*Defined in [Configuration.ts:231](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L231)*

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

*Defined in [constructs.ts:39](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L39)*

___

####  GCM

• **GCM**: = "gcm"

*Defined in [constructs.ts:40](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L40)*

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
* [saltLength](#saltlength)

### Properties

####  decryption_cbc

• **decryption_cbc**: *[DecryptionFunction](#interfacesdecryptionfunctionmd)*

*Defined in [Configuration.ts:24](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L24)*

AES-CBC decryption function

___

####  decryption_gcm

• **decryption_gcm**: *[DecryptionFunction](#interfacesdecryptionfunctionmd)*

*Defined in [Configuration.ts:28](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L28)*

AES-GCM decryption function

___

####  derivationRounds

• **derivationRounds**: *number*

*Defined in [Configuration.ts:32](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L32)*

Default number of key derivation iterations

___

####  deriveKey

• **deriveKey**: *[KeyDerivationFunction](#interfaceskeyderivationfunctionmd)*

*Defined in [Configuration.ts:36](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L36)*

Keys derivation function

___

####  encryption_cbc

• **encryption_cbc**: *[EncryptionFunction](#interfacesencryptionfunctionmd)*

*Defined in [Configuration.ts:40](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L40)*

AES-CBC encryption function

___

####  encryption_gcm

• **encryption_gcm**: *[EncryptionFunction](#interfacesencryptionfunctionmd)*

*Defined in [Configuration.ts:44](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L44)*

AES-GCM encryption function

___

####  generateIV

• **generateIV**: *[IVGenerationFunction](#interfacesivgenerationfunctionmd)*

*Defined in [Configuration.ts:48](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L48)*

Random IV generation function

___

####  generateSalt

• **generateSalt**: *[SaltGenerationFunction](#interfacessaltgenerationfunctionmd)*

*Defined in [Configuration.ts:52](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L52)*

Random salt generation function

___

####  method

• **method**: *[EncryptionType](#enumsencryptiontypemd)*

*Defined in [Configuration.ts:56](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L56)*

The encryption method - cbc/gcm

___

####  saltLength

• **saltLength**: *number*

*Defined in [Configuration.ts:60](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/Configuration.ts#L60)*

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

*Defined in [constructs.ts:5](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L5)*

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

• **hmac**: *Buffer | null*

*Defined in [constructs.ts:12](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L12)*

___

####  key

• **key**: *Buffer*

*Defined in [constructs.ts:11](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L11)*

___

####  rounds

• **rounds**: *number*

*Defined in [constructs.ts:13](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L13)*

___

####  salt

• **salt**: *string*

*Defined in [constructs.ts:10](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L10)*


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

*Defined in [constructs.ts:20](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L20)*

___

####  content

• **content**: *string*

*Defined in [constructs.ts:17](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L17)*

___

####  iv

• **iv**: *string*

*Defined in [constructs.ts:18](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L18)*

___

####  method

• **method**: *[EncryptionType](#enumsencryptiontypemd)*

*Defined in [constructs.ts:22](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L22)*

___

####  rounds

• **rounds**: *number*

*Defined in [constructs.ts:21](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L21)*

___

####  salt

• **salt**: *string*

*Defined in [constructs.ts:19](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L19)*


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

*Defined in [constructs.ts:30](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L30)*

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

▸ (): *Promise‹Buffer›*

*Defined in [constructs.ts:46](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L46)*

Random IV generation function - returns an IV buffer aynchronously

**Returns:** *Promise‹Buffer›*


<a name="interfaceskeyderivationfunctionmd"></a>

[iocane](#readmemd) › [KeyDerivationFunction](#interfaceskeyderivationfunctionmd)

## Interface: KeyDerivationFunction

Key derivation method - returns a buffer, asynchronously, that matches
the specified number of bits (in hex form). Takes a raw password,
random salt, number of derivation rounds/iterations and the bits of
key to generate.

### Hierarchy

* **KeyDerivationFunction**

### Callable

▸ (`password`: string, `salt`: string, `rounds`: number, `bits`: number): *Promise‹Buffer›*

*Defined in [constructs.ts:56](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L56)*

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

**Returns:** *Promise‹Buffer›*


<a name="interfacessaltgenerationfunctionmd"></a>

[iocane](#readmemd) › [SaltGenerationFunction](#interfacessaltgenerationfunctionmd)

## Interface: SaltGenerationFunction

Salt generation function - takes a string length as the only parameter
and returns a random salt string asynchronously.

### Hierarchy

* **SaltGenerationFunction**

### Callable

▸ (`length`: number): *Promise‹string›*

*Defined in [constructs.ts:70](https://github.com/perry-mitchell/iocane/blob/ed4afc7/source/constructs.ts#L70)*

Salt generation function - takes a string length as the only parameter
and returns a random salt string asynchronously.

**Parameters:**

Name | Type |
------ | ------ |
`length` | number |

**Returns:** *Promise‹string›*
