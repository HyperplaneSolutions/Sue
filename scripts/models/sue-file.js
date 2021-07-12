class SueFile{
    constructor(name, mimeType, data){
        this.name = name;
        this.mimeType = mimeType;
        this.data = data;
    }

    ToString(){
        return JSON.stringify(this);
    }
}