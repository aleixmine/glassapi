import { FileSystemDB } from "./FileSystemDB";

export class WorldsListController {
    constructor(private fs: FileSystemDB) {}

    async get(): Promise<string[]> {
        const dec = new TextDecoder();
        const list = await this.fs.getFile("worlds_list.txt");
        return list ? dec.decode(list.data as ArrayBuffer).split("\n") : [];
    }

    async set(list: string[]): Promise<void> {
        const enc = new TextEncoder();
        const listResult = enc.encode(list.join("\n")).buffer;
        await this.fs.setFile("worlds_list.txt", listResult);
    }

    async add(name: string): Promise<void> {
        const list = await this.get();
        list.push(name);
        await this.set(list);
    }

    async delete(name: string): Promise<void> {
        let list = await this.get();
        list = list.filter(world => world !== name);
        await this.set(list);
    }

    async clear(): Promise<void> {
        await this.set([]);
    }
}