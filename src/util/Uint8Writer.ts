export class Uint8Writer {
    textEncoder: TextEncoder;

    buffer: Uint8Array;
    constructor() {
        this.buffer = new Uint8Array();
        this.textEncoder=new TextEncoder();

    }
    addData(data: Uint8Array) {
        if (!(data instanceof Uint8Array)) {
            throw new TypeError("data must be an instance of Uint8Array");
        }
        let newBuffer = new Uint8Array(this.buffer.length + data.length);
        newBuffer.set(this.buffer);
        newBuffer.set(data, this.buffer.length);
        this.buffer = newBuffer;
    }
    writeByte(value: number) {
        this.addData(Uint8Array.of(value));
    }
    writeByteString(value: string) {
        const encodedValue = this.textEncoder.encode(value);
        this.writeByte(encodedValue.length);
        this.addData(encodedValue);
    }
    writeShortString(value: string) {
        const encodedValue = this.textEncoder.encode(value);
        this.writeShort(encodedValue.length);
        this.addData(encodedValue);
    }
    writeIntString(value: string) {
        const encodedValue = this.textEncoder.encode(value);
        this.writeInt(encodedValue.length);
        this.addData(encodedValue);
    }
    writeShort(num: number) {
        this.addData(Uint8Array.of((num >>> 8) & 0xFF, num & 0xFF));
    }
    writeInt(num: number) {
        this.addData(Uint8Array.of((num >>> 24) & 0xFF, (num >>> 16) & 0xFF, (num >>> 8) & 0xFF, num & 0xFF));
    }
    writeLong(num: number) {
        this.addData(Uint8Array.of(
            (num >>> 56) & 0xFF, (num >>> 48) & 0xFF, (num >>> 40) & 0xFF, (num >>> 32) & 0xFF,
            (num >>> 24) & 0xFF, (num >>> 16) & 0xFF, (num >>> 8) & 0xFF, num & 0xFF
        ));
    }
}