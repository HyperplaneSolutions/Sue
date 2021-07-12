class SueFiles {

    static MIME_EXTENSION_MAP = {
        "text/plain": "txt",
        "application/octet-stream": "bin",
        "image/png": "png"
    }

    static getFileExtensionFromMimeType(mimeType) {
        if (this.MIME_EXTENSION_MAP.hasOwnProperty(mimeType)) {
            return this.MIME_EXTENSION_MAP[mimeType];
        } else {
            throw "File extension is not mapped for mime type " + mimeType;
        }
    }

    static downloadFile(base64Data, fileName, mimeType, alreadyHasExtension) {
        let dataString = alreadyHasExtension ? base64Data : `data:${mimeType};base64,${base64Data}`;
        download(dataString, `${fileName}${alreadyHasExtension ? "" : "." + this.getFileExtensionFromMimeType(mimeType)}`, "." + mimeType);
    }

    static getBase64FromBinaryFileString(str){
        let keyHeader = "data:application/octet-stream;base64,";
        if(str.indexOf(keyHeader) > -1){
            let lastIndex = keyHeader.length;
            return str.slice(lastIndex);
        }

    }   

    static getRandomKeyFileName(fileType) {
        return `${fileType}-xxxx-xxxx-xxxx-xxxx`.replace(/[x]/g, function (c) {
            var r = Math.random() * 16 | 0;
            return r.toString(16);
        });
    }
}