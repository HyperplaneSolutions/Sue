class SueEncoding {

    static BASE_64_SIGNS_ORDERED = Base64._keyStr;

    static encodeUtf8AsBase64(utf8Txt) {
        return Base64.encode(utf8Txt);
    };

    static decodeUtf8FromBase64(base64) {
        let decoded = Base64.decode(base64);

        for (let index = 0; index < 3; index++) {
            if (decoded[decoded.length - 1] == '\u0000')
                decoded = decoded.substring(0, decoded.length - 1);
        }

        return decoded;
    };
}