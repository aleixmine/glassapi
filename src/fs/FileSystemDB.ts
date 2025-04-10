import { IndexedDBStore } from '../db/IndexedDBStore';

export interface BasicFile {
    path: string;
    data: ArrayBuffer;
}

export class FileSystemDB {
    constructor(private dbStore: IndexedDBStore) {}

    async setFile(path: string, data: any): Promise<void> {
        await this.dbStore.set({ path, data });
    }

    async getFile(path: string): Promise<BasicFile | null> {
        return (await this.dbStore.get<BasicFile>(path)) || null;
    }

    async deleteFile(path: string): Promise<void> {
        await this.dbStore.delete(path);
    }

    async renameFile(oldPath: string, newPath: string): Promise<void> {
        const file = await this.getFile(oldPath);
        if (file) {
            await this.setFile(newPath, file.data);
            await this.deleteFile(oldPath);
        }
    }

    async fileExists(path: string): Promise<boolean> {
        return !!(await this.getFile(path));
    }

    async setDirectory(path: string): Promise<void> {
        await this.dbStore.set({ path, data: null });
    }

    async deleteDirectory(path: string): Promise<void> {
        const files = await this.listDirectory(path);
        for (const file of files) {
            await this.deleteFile(file.path);
        }
    }

    async listDirectory(path: string): Promise<BasicFile[]> {
        const allFiles = await this.dbStore.getAll<BasicFile>();
        return allFiles.filter(file => file.path.startsWith(path));
    }
}