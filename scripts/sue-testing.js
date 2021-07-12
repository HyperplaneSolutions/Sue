function testSue() {
    let failedCount = 0;

    console.log('>>     Running test 1/4...');
    if (!encodingTest()) {
        alert('Failed test encodingTest');
        failedCount++;
    }

    console.log('>>     Running test 2/4...');
    if (!simplePayloadTest()) {
        alert('Failed test simplePayloadTest');
        failedCount++;
    }

    console.log('>>     Running test 3/4...');
    if (!simple10MbPayloadTest()) {

        alert('Failed test simple10MbPayloadTest');
        failedCount++;
    }

    console.log('>>     Running test 4/4...');
    if (!randomExoticUtf8PayloadTest()) {
        alert('Failed test entireUtf8PayloadTest');
        failedCount++;
    }

    if (failedCount == 0){
        console.log('Passed all tests :) ');
        alert('Passed all tests :) ');
    }
    else
        console.log(`Failed ${failedCount} tests!`);
}

function encodingTest() {
    let payload = "U顿䵣⢉-翷#9ܵk>짝衤嬵РRꛟ�贩쁀;�룋6ۜ捂⿞<ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let payloadBase64 = SueEncoding.encodeUtf8AsBase64(payload);
    let utfCycled = SueEncoding.decodeUtf8FromBase64(payloadBase64);

    return payload == utfCycled;
}

function simplePayloadTest() {
    let payload = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let decrypted = testFullCryptoCycle(payload);
    return payload == decrypted;
}

function simple10MbPayloadTest() {
    let payload = get10MbPayload();
    let decrypted = testFullCryptoCycle(payload);
    return payload == decrypted;
}

function randomExoticUtf8PayloadTest() {
    let payload = getRandomExoticUtf8Payload();
    let decrypted = testFullCryptoCycle(payload);
    return payload == decrypted;
}

function testFullCryptoCycle(_payload) {
    let _key = SueEncryption.generateKey(_payload.length * 4);
    if (_key == null || _key.length == 0)
        throw "Error during key generation";
    loadedKey = new KeyFile('test', _key, _key.length * (6 / 8));

    let _payloadBase64 = SueEncoding.encodeUtf8AsBase64(_payload);
    if (_payloadBase64 == null || _payloadBase64.length == 0)
        throw "Error during Base64 encoding";

    let _encryptedBase64 = SueEncryption.encryptData(_payloadBase64, loadedKey.data, 0);

    if (_encryptedBase64 == null || _encryptedBase64.length == 0)
        throw "Error during dncryption";

    let _decryptedBase64 = SueEncryption.decryptData(_encryptedBase64, loadedKey.data, 0);
    if (_decryptedBase64 == null || _decryptedBase64.length == 0)
        throw "Error during decryption";

    let _decryptedUtf8 = SueEncoding.decodeUtf8FromBase64(_decryptedBase64);
    if (_decryptedUtf8 == null || _decryptedUtf8.length == 0)
        throw "Error during decryption";

    return _decryptedUtf8;
}

function get10MbPayload() {
    let needChars = 5242880;
    let one_line = 10;
    let needCycles = needChars / one_line;

    var lines = [];
    for (let i = 0; i < needCycles; i++) {
        let tenChars = Math.random().toString(36).substring(2, 15);
        lines.push(tenChars);
    }

    return lines.join('');
}

function getRandomExoticUtf8Payload() {
    return "АаБбВвГгДдЕеЖжЗзИиКкЛлМмНнОоПпРрСсТтУуФфХхЦцЧчШшΑ α, Β β, Γ γ, Δ δ, Ε ε, Ζ ζ, Η η, Θ θ, Ι ι, Κ κ, Λ λ, Μ μ, Ν ν, Ξ ξ, Ο ο, Π π, Ρ ρ, Σ σ/ς, Τ τ, Υ υ, Φ φ, Χ χexamples include チェ (che) in チェンジ chenji (change), ファ (fa) in ファミリー famirī (family) and ウィ (wi) and ディ (di) in ウィキペディア";
}