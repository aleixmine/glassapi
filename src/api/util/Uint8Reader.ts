export class Uint8Reader {
    buffer: Uint8Array;
    offset: number;

    constructor(buffer:Uint8Array) {
        if (!buffer) {
            throw new Error("Buffer is required");
        }
        this.buffer = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        this.offset = 0;
    }
    read() {
        if (this.offset >= this.buffer.length) {
            throw new Error("Read out of bounds");
        }
        return this.buffer[this.offset];
    }
    readByte() {
        if (this.offset >= this.buffer.length) {
            throw new Error("Read out of bounds");
        }
        return this.buffer[this.offset++];
    }
    advance(num:number) {
        if (this.offset + num > this.buffer.length) {
            throw new Error("Advance out of bounds");
        }
        this.offset += num;
    }
    readShort() {
        if (this.offset + 2 > this.buffer.length) {
            throw new Error("ReadShort out of bounds");
        }
        const value = (this.buffer[this.offset] << 8) | this.buffer[this.offset + 1];
        this.offset += 2;
        return value;
    }
    readInt() {
        if (this.offset + 4 > this.buffer.length) {
            throw new Error("ReadInt out of bounds");
        }
        const value = (this.buffer[this.offset] << 24) |
            (this.buffer[this.offset + 1] << 16) |
            (this.buffer[this.offset + 2] << 8) |
            this.buffer[this.offset + 3];
        this.offset += 4;
        return value;
    }
    readString() {
        const len = this.readByte();
        if (this.offset + len > this.buffer.length) {
            throw new Error("ReadString out of bounds");
        }
        let str = "";
        for (let i = 0; i < len; i++) {
            str += String.fromCharCode(this.readByte());
        }
        return str;
    }
    readShortString() {
        const len = this.readShort();
        if (this.offset + len > this.buffer.length) {
            throw new Error("ReadString out of bounds");
        }
        let str = "";
        for (let i = 0; i < len; i++) {
            str += String.fromCharCode(this.readByte());
        }
        return str;
    }
}