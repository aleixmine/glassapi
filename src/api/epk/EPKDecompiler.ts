import { crc32 } from "../util/crc32";
import { Uint8Reader } from "../util/Uint8Reader";
import * as fflate from 'fflate';

const equals = (arr1: Uint8Array, arr2: Uint8Array) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

export class EPKDecompiler {

    static epkOldHeader = "EAGPKG!!";
    static epkNewHeader = "EAGPKG$$";
    static epkFooter = ":::YEE:>";

    data: Uint8Array;
    header: Uint8Array;
    footer: Uint8Array;
    body: Uint8Reader;
    textDecoder: TextDecoder;
    textEncoder: TextEncoder;
    version: string;
    fileName: string;
    comment: string;
    numFiles: number;
    compressionType: string;
    contentBody: Uint8Reader;
    filesRead: number;
    files: (number | { type: string; name: string; data: Blob; })[];

    constructor(data: Uint8Array) {
        if (!(data instanceof Uint8Array)) {
            throw new Error("Data must be an instance of Uint8Array");
        }

        // Init data
        this.data = data;
        this.header = data.slice(0, 8);
        this.footer = data.slice(-8);
        this.body = new Uint8Reader(data.slice(8, -8));

        this.textDecoder = new TextDecoder();
        this.textEncoder = new TextEncoder();

        // Validate EPK file
        if (equals(this.header, this.textEncoder.encode(EPKDecompiler.epkNewHeader))) {
            if (!equals(this.footer, this.textEncoder.encode(EPKDecompiler.epkFooter)))
                throw new Error("EPK file is missing EOF code (:::YEE:>)");
        } else if (equals(this.header, this.textEncoder.encode(EPKDecompiler.epkOldHeader))) {
            throw new Error("FILE IS AN UNSUPPORTED LEGACY FORMAT!");
        } else {
            throw new Error("FILE IS NOT AN EPK FILE!");
        }

        this.version = "";
        this.fileName = "";
        this.comment = "";
        this.numFiles = -1;
        this.compressionType = "0"
        this.contentBody = new Uint8Reader(new Uint8Array());
        this.filesRead = 0;
        this.files = [];
    }

    async decompile() {
        this.body.offset = 0;
        this.version = this.body.readString();
        this.fileName = this.body.readString();
        this.comment = this.body.readShortString();

        this.body.advance(8);

        this.numFiles = this.body.readInt();
        this.compressionType = String.fromCharCode(this.body.readByte());

        let contentBody = this.body.buffer.slice(this.body.offset)

        if (this.compressionType == "Z" || this.compressionType == "G") {
            try {
                contentBody = await fflate.decompressSync(contentBody);
            } catch (err) {
                return null;
            }
        } else if (this.compressionType == "0") {
            // do nothing
        } else {
            return null;
        }
        this.contentBody = new Uint8Reader(contentBody);
        this.readFiles();
        return this.files;
    }

    readFiles() {
        let files = [];
        let file;
        this.filesRead = 0;
        while ((file = this.readFile()) != null) {
            if (file == -1) return null;
            files.push(file);
        }
        this.files = files;
    }

    readFile() {
        const type = this.textDecoder.decode(new Uint8Array([this.contentBody.readByte(), this.contentBody.readByte(), this.contentBody.readByte(), this.contentBody.readByte()]));

        if (this.numFiles == this.filesRead) {
            if (type != "END$") {
                return -1;
            }
            return null;
        }

        if (type == "END$") {
            return -1;
        }

        const name = this.contentBody.readString();
        const len = this.contentBody.readInt();
        let blob = null;

        if (type == "FILE") {
            if (len < 5) {
                return -1;
            }

            const crc = this.contentBody.readInt();
            const blobBuffer = this.contentBody.buffer.slice(this.contentBody.offset, this.contentBody.offset + len - 5);
            this.contentBody.advance(len - 5);
            blob = new Blob([blobBuffer]);

            if (crc != (crc32(blobBuffer) | 0)) {
                return -1;
            }

            if (this.contentBody.readByte() != 58) {
                return -1;
            }
        } else {
            blob = new Blob([this.contentBody.buffer.slice(this.contentBody.offset, this.contentBody.offset + len)]);
            this.contentBody.advance(len);
        }

        if (this.contentBody.readByte() != 62) {
            return -1;
        }

        this.filesRead++;

        return {
            type: type,
            name: name,
            data: blob
        };
    }
}