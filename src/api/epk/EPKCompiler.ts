import { crc32 } from "../util/crc32";
import { Uint8Writer } from "../util/Uint8Writer";
import * as fflate from 'fflate';

export class EPKCompiler {
    fileType: string;
    fileName: string;
    comment: string;
    version: string;
    bufferWriter: Uint8Writer;
    textEncoder: TextEncoder;

    constructor(fileType: string, fileName: string, comment = "# eaglercraft package file - generated with GlassAPI", version = "ver2.0") {
        this.fileType = fileType;
        this.fileName = fileName;
        this.comment = comment;
        this.version = version;
        this.bufferWriter = new Uint8Writer();
        this.textEncoder = new TextEncoder();
    }

    addHeaderEntry(key: string, value: string) {
        this.bufferWriter.addData(this.textEncoder.encode('HEAD'));
        this.bufferWriter.writeByteString(key);
        this.bufferWriter.writeIntString(value);
        this.bufferWriter.addData(Uint8Array.of(62)); // ASCII '>'
    }

    addFileEntry(name: string, type: string, fileData: Uint8Array) {
        this.bufferWriter.addData(this.textEncoder.encode(type));
        this.bufferWriter.writeByteString(name);
        this.bufferWriter.writeInt(fileData.byteLength + 5); // 5 bytes for CRC32 and delimiter
        this.bufferWriter.writeInt(crc32(fileData));
        this.bufferWriter.addData(fileData);
        this.bufferWriter.addData(this.textEncoder.encode(':>'));
    }

    async compile(headerFiles: { name: string; type: string; data: Blob; }[], bodyFiles: { name: string; type: string; data: Blob; }[]) {
        // Add header entries
        this.addHeaderEntry("file-type", this.fileType);

        for (const file of headerFiles) {
            this.addFileEntry(file.name, file.type, new Uint8Array(await file.data.arrayBuffer()));
        }

        for (const file of bodyFiles) {
            this.addFileEntry(file.name, file.type, new Uint8Array(await file.data.arrayBuffer()));
        }

        // Add end marker
        this.bufferWriter.addData(this.textEncoder.encode('END$'));

        // Create the final package
        const finalPackageBuffer = new Uint8Writer();
        finalPackageBuffer.addData(this.textEncoder.encode('EAGPKG$$')); // Package header
        finalPackageBuffer.writeByteString(this.version);
        finalPackageBuffer.writeByteString(this.fileName);
        finalPackageBuffer.writeShortString(this.comment);
        finalPackageBuffer.writeLong(Date.now());
        finalPackageBuffer.addData(Uint8Array.of(90)); // Compression type ('Z')
        finalPackageBuffer.writeInt(bodyFiles.length + headerFiles.length);

        // Compress and add the main buffer
        const compressedData = fflate.deflateSync(this.bufferWriter.buffer, { level: 9 });
        finalPackageBuffer.addData(new Uint8Array(compressedData));
        finalPackageBuffer.addData(this.textEncoder.encode(':::YEE:>')); // Package footer

        return finalPackageBuffer.buffer;
    }
}