class KeyFile {
    constructor(name, data, size){
        this.name = name;
        this.data = data;
        this.size = size;
    }

    getAnonymousSignature(){
        return `${this.name} (${this.size})`;
    }
}