import { FileSystemDB } from "./FileSystemDB";

export class ResourcePacksManifestController {
    constructor(private fs: FileSystemDB) {}

    async get(): Promise<{ resourcePacks: any[] }> {
        const dec = new TextDecoder();
        const manifest = await this.fs.getFile("resourcepacks/manifest.json");
        return manifest ? JSON.parse(dec.decode(manifest.data as ArrayBuffer)) : { resourcePacks: [] };
    }

    async set(json: { resourcePacks: any[] }): Promise<void> {
        const enc = new TextEncoder();
        const manifestResult = enc.encode(JSON.stringify(json)).buffer;
        await this.fs.setFile("resourcepacks/manifest.json", manifestResult);
    }

    async add(pack: { domains: string[]; folder: string; name: string; timestamp: number }): Promise<void> {
        if (!pack || !Array.isArray(pack.domains) || typeof pack.folder !== "string" || typeof pack.name !== "string" || typeof pack.timestamp !== "number") {
            throw new Error("Invalid pack object");
        }
        const manifest = await this.get();
        manifest.resourcePacks.push(pack);
        await this.set(manifest);
    }

    async delete(name: string): Promise<void> {
        const manifest = await this.get();
        manifest.resourcePacks = manifest.resourcePacks.filter(pack => pack.name !== name);
        await this.set(manifest);
    }

    async clear(): Promise<void> {
        await this.set({ resourcePacks: [] });
    }
}