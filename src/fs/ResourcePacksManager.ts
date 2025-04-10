import { FileSystemDB } from "./FileSystemDB";
import { ResourcePacksManifestController } from "./ResourcePacksManifestController";

export class ResourcePacksManager {
    private manifest: ResourcePacksManifestController;

    constructor(private fs: FileSystemDB) {
        this.manifest = new ResourcePacksManifestController(fs);
    }

    async add(name: string, fileBytes: ArrayBuffer): Promise<boolean> {
        await (window as any).GlassAPI.util.WebResourceManager.loadScript("/libs/zip-fs-full.min.js");
        (window as any).zip.configure({ useWebWorkers: true });
        try {
            const blob = new Blob([fileBytes]);
            const zipReader = new (window as any).zip.ZipReader(new (window as any).zip.BlobReader(blob));
            const entries = await zipReader.getEntries();

            for (const entry of entries) {
                if (!entry.directory) {
                    const content = await entry.getData(new (window as any).zip.Uint8ArrayWriter());
                    await this.fs.setFile(`resourcepacks/${name}/${entry.filename}`, content.buffer);
                }
            }
            await zipReader.close();
        } catch (error) {
            return false;
        }
        await this.manifest.add({
            domains: ["minecraft"],
            folder: name,
            name: name,
            timestamp: Date.now()
        });
        return true;
    }

    addPrompt(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".zip";
            input.addEventListener("change", async (event: Event) => {
                const file = (event.target as HTMLInputElement).files?.[0];
                if (!file) return reject(false);
                try {
                    const fileBytes = await file.arrayBuffer();
                    await this.add(file.name.replace(".zip", ""), fileBytes);
                    resolve(true);
                } catch (error) {
                    reject(false);
                }
            });
            input.click();
        });
    }

    async delete(name: string): Promise<void> {
        await this.fs.deleteDirectory(`resourcepacks/${name}`);
        await this.manifest.delete(name);
    }

    async clear(): Promise<void> {
        await this.fs.deleteDirectory("resourcepacks");
        await this.manifest.clear();
    }
}
