class SueEncryption {
    static #KEY_SIZE_STEP = 1368; // Dues to data loss from storing the key file in base64 it is neccessary to generate additional signs to store 1024 full bytes

    static generateKey(sizeBytes) {
        let cryptoObj = window.crypto || window.msCrypto; // for IE 11

        if (typeof cryptoObj == 'undefined' || typeof cryptoObj.getRandomValues == 'undefined')
            throw "This browser doesn't support window.crypto or window.msCrypto - try Mozilla Firefox or Chrome";

        if (sizeBytes % this.#KEY_SIZE_STEP != 0)
            sizeBytes += this.#KEY_SIZE_STEP - (sizeBytes % this.#KEY_SIZE_STEP);

        if (sizeBytes % 2 != 0)
            sizeBytes += 1;

        const stepsToCreateKey = sizeBytes / this.#KEY_SIZE_STEP;
        let keyArray = [];

        for (let i = 0; i < stepsToCreateKey; i++) {
            let randoms = new Uint8Array(this.#KEY_SIZE_STEP);
            cryptoObj.getRandomValues(randoms);

            let randomBase64 = [];

            randoms.forEach(function (randomUINT8) {
                randomBase64.push(SueEncoding.BASE_64_SIGNS_ORDERED[randomUINT8 % 64]);
            });

            let randomKeyString = randomBase64.join('');

            keyArray.push(randomKeyString);
        }

        return keyArray.join('');
    }

    static encryptData(base64Data, key, keyStartIndex) {
        if (base64Data == null && base64Data.length == 0)
            throw "Nothing to encrypt";

        if (key == null && key.length == 0)
            throw "Valid key doesn't exist";

        if (key.length < keyStartIndex)
            throw "Key start index too big/ key too short";

        if (base64Data.length > (key.length - keyStartIndex))
            throw "With this start index the key is too small for the amount of data you are trying to encrypt";


        let encryptedArray = [];

        for (let i = 0; i < base64Data.length; i++) {
            let encryptedInt = SueEncoding.BASE_64_SIGNS_ORDERED.indexOf(base64Data[i]) + SueEncoding.BASE_64_SIGNS_ORDERED.indexOf(key[keyStartIndex + i]);
            //loop to begining of base64 table if int too big
            if (encryptedInt >= 64)
                encryptedInt = encryptedInt % 64;
            let encryptedBase64Sign = SueEncoding.BASE_64_SIGNS_ORDERED[encryptedInt];
            encryptedArray.push(encryptedBase64Sign);
        }
        console.log(encryptedArray.join(''));
        return encryptedArray.join('');
    }

    static decryptData(base64Encrypted, key, keyStartIndex) {
        if (base64Encrypted == null && base64Encrypted.length == 0)
            throw "Nothing to decrypt";

        if (key == null && key.length == 0)
            throw "Valid key doesn't exist";

        if (key.length < keyStartIndex)
            throw "Key start index too big/ key too short";

        if (base64Encrypted.length > (key.length - keyStartIndex))
            throw "With this start index the key is too small for the amount of data you are trying to decrypt";


        let decryptedArray = [];
        console.log(base64Encrypted);

        for (let i = 0; i < base64Encrypted.length; i++) {
            let decryptedInt = SueEncoding.BASE_64_SIGNS_ORDERED.indexOf(base64Encrypted[i]) - SueEncoding.BASE_64_SIGNS_ORDERED.indexOf(key[keyStartIndex + i]);
            //loop to begining of base64 table if int too big
            if (decryptedInt < 0)
                decryptedInt = decryptedInt + 64;
            let decryptedBase64Sign = SueEncoding.BASE_64_SIGNS_ORDERED[decryptedInt];
            decryptedArray.push(decryptedBase64Sign);
        }

        return decryptedArray.join('');
    }
}