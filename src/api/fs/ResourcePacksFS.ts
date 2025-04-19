import { FileSystemDB } from "./FileSystemDB";
import { IndexedDBStore } from "../db/IndexedDBStore";
import { DatabaseManager } from "../db/DatabaseManager";

export class ResourcePacksFS extends FileSystemDB {
    private dbName: string | null = null;
    private dbManager: DatabaseManager | null = null;

    constructor() {
        super(null as unknown as IndexedDBStore);
    }

    async open(): Promise<void> {
        const configResourcePacks = (window as any).eaglercraftXOpts.resourcePacksDB;
        const dbList = await indexedDB.databases();
        const dbEntry = dbList.find(db => db?.name?.endsWith("_" + (configResourcePacks || "resourcePacks")));

        if (!dbEntry || !dbEntry.name) {
            throw new Error("Resource Packs database not found.");
        }

        this.dbName = dbEntry.name;
        this.dbManager = new DatabaseManager(this.dbName, 1, () => {});
        await this.dbManager.open();
        super.constructor(new IndexedDBStore(this.dbManager, "filesystem"));
    }
}