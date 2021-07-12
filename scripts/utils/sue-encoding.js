class SueEncoding {

    static BASE_64_SIGNS_ORDERED = Base64._keyStr;

    static encodeUtf8AsBase64(utf8Txt) {
        return Base64.encode(utf8Txt);
    };

    static decodeUtf8FromBase64(base64) {
        return Base64.decode(base64);
      };
  }