let loadedKey = null;

$(function () {
    setEventHandlers();
});

function generateKeyFile(sizeBytes) {
    let key = SueEncryption.generateKey(sizeBytes);
    let keyName = SueFiles.getRandomKeyFileName('key');
    loadedKey = new KeyFile(keyName, key, key.length * (6/8));
    SueFiles.downloadFile(key, keyName, "application/octet-stream");
    updateKeyStatus();
}

function readKeyFile() {
    if (this.files.length < 1)
        throw "The Key file was not selected";

    let file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        let keyData = SueFiles.getBase64FromBinaryFileString(reader.result);
        loadedKey = new KeyFile(file.name, keyData, file.size);
        updateKeyStatus();
    };
    reader.readAsDataURL(file);
}

function encryptFile() {
    if (this.files.length < 1)
        throw "No files selected";

    let file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        let originalFile = new SueFile(file.name, file.type, reader.result);
        let encryptedBase64 = SueEncryption.encryptData(SueEncoding.encodeUtf8AsBase64(originalFile.ToString()), loadedKey.data, 0);
        SueFiles.downloadFile(encryptedBase64, SueFiles.getRandomKeyFileName('encrypted'), "application/octet-stream");
    };
    reader.readAsDataURL(file);
}


function decryptFile() {
    if (this.files.length < 1)
        throw "No files selected";

    let file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        console.log(file, reader.result);
        let fileData = SueFiles.getBase64FromBinaryFileString(reader.result);
        let decryptedBase64 = SueEncryption.decryptData(fileData, loadedKey.data, 0);
        let fileObj = JSON.parse(SueEncoding.decodeUtf8FromBase64(decryptedBase64));
        console.log(fileObj);
        SueFiles.downloadFile(fileObj.data, fileObj.name, fileObj.mimeType, true);
    };
    reader.readAsDataURL(file);
}

function updateKeyStatus(){
    if(loadedKey == null){
        $('.key-selection .block-btn').removeClass('success');
        $('.operation-selection').addClass('d-none');
        $('.key-div').addClass('d-none');
    }
    else{
        $('.key-selection .block-btn').addClass('success');
        $('.operation-selection').removeClass('d-none');
        $('.key-div').removeClass('d-none');
        $('.key-name').text(loadedKey.name);
        $('.key-size').text((loadedKey.size/1024).toString() + " Mb");
    }
}

function showSectionEncrypt() {
    $('#slide-encryption').removeClass('d-none');
    $('#slide-decryption').addClass('d-none');
    $('#btnEncrypt').addClass('active');
    $('#btnDecrypt').removeClass('active');
}

function showSectionDecrypt() {
    $('#slide-encryption').addClass('d-none');
    $('#slide-decryption').removeClass('d-none');
    $('#btnEncrypt').removeClass('active');
    $('#btnDecrypt').addClass('active');
}

////#region Events
function setEventHandlers() {
    const keyFileInput = document.getElementById("keyFileInput");
    keyFileInput.addEventListener("change", readKeyFile, false);

    const encryptFileInput = document.getElementById("encryptFileInput");
    encryptFileInput.addEventListener("change", encryptFile, false);

    const decryptFileInput = document.getElementById("decryptFileInput");
    decryptFileInput.addEventListener("change", decryptFile, false);
}


function onClickGenerateKeyFile() {
    generateKeyFile(50000);
}

function onClickReadKeyFile() {
    let keyFileInput = document.getElementById("keyFileInput");

    if (keyFileInput) {
        keyFileInput.click();
    }
}

function onClickEncryptText() {
    let taEncrypt = document.getElementById("taEncrypt");
    var originalText = taEncrypt.value;
    console.log(SueEncoding.encodeUtf8AsBase64(originalText));
    var encryptedTextBase64 = SueEncryption.encryptData(SueEncoding.encodeUtf8AsBase64(originalText), loadedKey.data, 0);
    let taDecrypt = document.getElementById("taDecrypt");
    taDecrypt.value = encryptedTextBase64;
}

function onClickDecryptText() {
    let taDecrypt = document.getElementById("taDecrypt");
    var encryptedText = taDecrypt.value;
    var originalTextBase64 = SueEncryption.decryptData(encryptedText, loadedKey.data, 0);
    let taEncrypt = document.getElementById("taEncrypt");
    taEncrypt.value = SueEncoding.decodeUtf8FromBase64(originalTextBase64);
}

function onClickEncryptFile() {
    let encryptFileInput = document.getElementById("encryptFileInput");

    if (encryptFileInput) {
        encryptFileInput.click();
    }
}

function onClickDecryptFile() {
    let decryptFileInput = document.getElementById("decryptFileInput");

    if (decryptFileInput) {
        decryptFileInput.click();
    }
}

////#endregion