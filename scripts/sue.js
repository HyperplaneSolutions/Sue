let loadedKey = null;

$(function () {
    configureToastr();
    setEventHandlers();
});

function generateKeyFile(sizeBytes) {
    showBusy(true);

    let key = SueEncryption.generateKey(sizeBytes);
    let keyName = SueFiles.getRandomKeyFileName('key');
    loadedKey = new KeyFile(keyName, key, key.length * (6 / 8));
    SueFiles.downloadFile(key, keyName, "application/octet-stream");
    updateKeyStatus();
    toastr.success(loadedKey.getAnonymousSignature(), 'Key successfully generated and loaded');

    showBusy(false);
}

function readKeyFile() {
    showBusy(true);

    if (this.files.length < 1)
        throw "The Key file was not selected";

    let file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        let keyData = SueFiles.getBase64FromBinaryFileString(reader.result);
        loadedKey = new KeyFile(file.name, keyData, file.size);
        updateKeyStatus();
        toastr.success(loadedKey.getAnonymousSignature(), 'Key successfully loaded');
    };
    reader.readAsDataURL(file);

    showBusy(false);
}

function encryptFile() {
    showBusy(true);

    if (this.files.length < 1)
        throw "No files selected";

    let file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        let originalFile = new SueFile(file.name, file.type, reader.result);
        let encryptedBase64 = SueEncryption.encryptData(SueEncoding.encodeUtf8AsBase64(originalFile.ToString()), loadedKey.data, getKeyStart());

        if(encryptedBase64 == null)
            return;

        SueFiles.downloadFile(encryptedBase64, SueFiles.getRandomKeyFileName('encrypted'), "application/octet-stream");

        showBusy(false);
        toastr.success('File successfully encrypted - downloading');
        onEncryptMessage();
    };
    reader.readAsDataURL(file);
}


function decryptFile() {
    showBusy(true);

    if (this.files.length < 1)
        throw "No files selected";

    let file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        let fileData = SueFiles.getBase64FromBinaryFileString(reader.result);
        let decryptedBase64 = SueEncryption.decryptData(fileData, loadedKey.data, getKeyStart());

        if(decryptedBase64 == null)
            return;

        let fileObj = JSON.parse(SueEncoding.decodeUtf8FromBase64(decryptedBase64));
        SueFiles.downloadFile(fileObj.data, fileObj.name, fileObj.mimeType, true);

        showBusy(false);
        toastr.success('File successfully decrypted - downloading');
        onDecryptMessage()
    };
    reader.readAsDataURL(file);
}


function updateKeyStatus() {
    if (loadedKey == null) {
        $('.key-selection .block-btn').removeClass('success');
        $('.operation-selection').addClass('d-none');
        $('.key-div').addClass('d-none');
        $(".title-div").removeClass('key-selected');
    }
    else {
        $('.key-selection .block-btn').addClass('success');
        $('.operation-selection').removeClass('d-none');
        $('.key-div').removeClass('d-none');
        $('.key-name').text(loadedKey.name);
        $('.key-size').text((loadedKey.size / 1024).toString() + " Kb");
        $(".title-div").addClass('key-selected');
        $('.key-start-selector-div span').text(loadedKey.size * (8/6) - 1);
        $('#tbKeyStart').attr("max", loadedKey.size * (8/6) - 1);
    }
}

function assumeMaxKeyStart() {
    let max = parseInt($('#tbKeyStart').attr("max"));
    if (parseInt($('#tbKeyStart').val()) >= max)
        $('#tbKeyStart').val(max);
}

function getKeyStart() {
    return parseInt($('#tbKeyStart').val());
}

function onEncryptMessage() {
    $('.info-text').removeClass('d-none');
    $('.info-text #spanKeyName').text(loadedKey.name);
    $('.info-text #spanKeyStart').text(getKeyStart());
}

function onDecryptMessage() {
    $('.info-text').addClass('d-none');
}

function showSectionEncrypt() {
    $('#slide-encryption').removeClass('d-none');
    $('#slide-decryption').addClass('d-none');
    $('#btnEncrypt').addClass('active');
    $('#btnDecrypt').removeClass('active');
    $('.text-area-encrypt i').addClass('active');
    $('.text-area-decrypt i').removeClass('active');
}

function showSectionDecrypt() {
    $('#slide-encryption').addClass('d-none');
    $('#slide-decryption').removeClass('d-none');
    $('#btnEncrypt').removeClass('active');
    $('#btnDecrypt').addClass('active');
    $('.text-area-decrypt i').addClass('active');
    $('.text-area-encrypt i').removeClass('active');
}

function showBusy(show) {
    if (show) {
        $('#loader').removeClass('hidden');
    } else {
        $('#loader').addClass('hidden');
    }
}

function configureToastr() {
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "8000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
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

function onClickOpenGenerateKeyModal() {
    var el = document.getElementById('aOpenModal');
    nativeClickLink(el);
}

function onClickGenerateKeyFile() {
    var el = document.getElementById('btnCloseModal');
    nativeClickLink(el);
    generateKeyFile(Math.floor(parseInt($('#tbKeySize').val()) * 1024 * (8/6)));
}

function onClickReadKeyFile() {
    let keyFileInput = document.getElementById("keyFileInput");

    if (keyFileInput) {
        keyFileInput.click();
    }
}

function onClickEncryptText() {
    showBusy(true);

    let taEncrypt = document.getElementById("taEncrypt");
    let taDecrypt = document.getElementById("taDecrypt");
    taDecrypt.value = "";
    var originalText = taEncrypt.value;
    var encryptedTextBase64 = SueEncryption.encryptData(SueEncoding.encodeUtf8AsBase64(originalText), loadedKey.data, getKeyStart());
    
    if(encryptedTextBase64 == null)
        return;

    taDecrypt.value = encryptedTextBase64;
    toastr.success('Text successfully encrypted');
    onEncryptMessage();

    showBusy(false);
}

function onClickDecryptText() {
    showBusy(true);

    let taDecrypt = document.getElementById("taDecrypt");
    let taEncrypt = document.getElementById("taEncrypt");
    taEncrypt.value = "";
    var encryptedText = taDecrypt.value;
    var originalTextBase64 = SueEncryption.decryptData(encryptedText, loadedKey.data, getKeyStart());

    if(originalTextBase64 == null)
        return;

    taEncrypt.value = SueEncoding.decodeUtf8FromBase64(originalTextBase64);
    toastr.success('Text successfully decrypted');
    onDecryptMessage()

    showBusy(false);
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

function nativeClickLink(el) {
        // Firefox
        if (document.createEvent) {
            var event = document.createEvent("MouseEvents");
            event.initEvent("click", true, true);
            el.dispatchEvent(event);
        }
        // IE
        else if (el.click) {
            el.click();
        }
}

////#endregion