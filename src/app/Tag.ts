const NDEF_TYPE:string = 'ndef';
const TAG_TYPE:string = 'tag';
const PACKAGE_TYPE:string = 'android.nfc.tech.';

export class Tag {
    id:Array<number>;
    techTypes:Array<string>;
    type:string;
    key:string;
    date:string;
    constructor(id?:Array<number>,techTypes?:Array<string>,type:string = TAG_TYPE) {
        this.id = id;
        this.techTypes = techTypes;
        this.type = type;
        this.formatTypes();
    }
    formatTypes() {
        if(this.techTypes) {
            let types:Array<string> = [];
            this.techTypes.forEach((type) => {
                type = type.replace(PACKAGE_TYPE,'');
                types.push(type);
            });
            this.techTypes = types;
        }
    }
}

export class TagRecord {
    id:Array<number>;
    payload:Array<number>;
    tnf:number;
    type:Array<number>;
    constructor(id:Array<number>, payload:Array<number>, tnf:number, type:Array<number>) {
        this.id = id;
        this.payload = payload;
        this.tnf = tnf;
        this.type = type;
    }
    getFormattedType() {
        return String.fromCharCode.apply(String, this.type);
    }
    getFormattedPayload() {
        return String.fromCharCode.apply(String, this.payload);
    }
}

export class NdefTag extends Tag {
    canMakeReadOnly:boolean;
    isWritable:boolean;
    maxSize:number;
    records:Array<TagRecord>;
    constructor(id:Array<number>,techTypes:Array<string>,canMakeReadOnly:boolean,isWritable:boolean, maxSize:number) {
        super(id,techTypes,NDEF_TYPE);
        this.canMakeReadOnly = canMakeReadOnly;
        this.isWritable = isWritable;
        this.maxSize = maxSize;
        this.records = [];
    }
    addRecord(record:TagRecord):void {
        this.records.push(record);
    }
}

export class TagUtil {

    public static readTagFromJson(tagEvent:any):Tag {
        let jsonTag:any = tagEvent.tag;
        if(tagEvent.type === TAG_TYPE) {
            return new Tag(jsonTag.id,jsonTag.techTypes,TAG_TYPE);
        } else if(tagEvent.type === NDEF_TYPE) {
            let tag:NdefTag = new NdefTag(jsonTag.id,jsonTag.techTypes,jsonTag.canMakeReadOnly,jsonTag.isWritable,jsonTag.maxSize);
            jsonTag.ndefMessage.forEach((record) => {
                tag.addRecord(new TagRecord(record.id,record.payload,record.tnf,record.type));
            });
            return tag;
        }
    }
}