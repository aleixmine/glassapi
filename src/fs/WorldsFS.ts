import { FileSystemDB } from "./FileSystemDB";
import { IndexedDBStore } from "../db/IndexedDBStore";
import { DatabaseManager } from "../db/DatabaseManager";

export class WorldsFS extends FileSystemDB {
    private dbName: string | null = null;
    private dbManager: DatabaseManager | null = null;

    constructor() {
        super(null as unknown as IndexedDBStore);
    }

    async open(): Promise<void> {
        const configWorlds = (window as any).eaglercraftXOpts.worldsDB;
        const dbList = await indexedDB.databases();
        const dbEntry = dbList.find(db => db?.name?.endsWith("_" + (configWorlds || "worlds")));

        if (!dbEntry || !dbEntry.name) {
            throw new Error("Worlds database not found.");
        }

        this.dbName = dbEntry.name;
        this.dbManager = new DatabaseManager(this.dbName, 1, () => {});
        await this.dbManager.open();
        super.constructor(new IndexedDBStore(this.dbManager, "filesystem"));
    }
}