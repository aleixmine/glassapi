import { DatabaseManager } from './DatabaseManager';

export class IndexedDBStore {
    constructor(private dbManager: DatabaseManager, private storeName: string) {}

    set<T>(value: T, key?: string): Promise<void> {
        return this.dbManager.set(this.storeName, value, key);
    }

    get<T>(key: string): Promise<T | undefined> {
        return this.dbManager.get(this.storeName, key);
    }

    delete(key: string): Promise<void> {
        return this.dbManager.delete(this.storeName, key);
    }

    clear(): Promise<void> {
        return this.dbManager.clear(this.storeName);
    }

    getAll<T>(): Promise<T[]> {
        return this.dbManager.getAll(this.storeName);
    }
}