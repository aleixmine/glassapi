export class DatabaseManager {
    private db: IDBDatabase | null = null;

    constructor(
        private dbName: string,
        private dbVersion: number,
        private onUpgrade: (db: IDBDatabase) => void=()=>{}
    ) {}

    private ensureDBOpen(): void {
        if (!this.db) {
            throw new Error("Database is not open. Call `open()` first.");
        }
    }

    async open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = event => {
                this.db = (event.target as IDBOpenDBRequest).result;
                this.onUpgrade(this.db);
            };

            request.onsuccess = event => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve(this.db);
            };

            request.onerror = event => reject((event.target as IDBRequest).error);
        });
    }

    private createTransaction(storeNames: string | string[], mode: IDBTransactionMode): IDBTransaction {
        this.ensureDBOpen();
        return this.db!.transaction(storeNames, mode);
    }

    async set<T>(storeName: string, value: T, key?: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.createTransaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = key ? store.put(value, key) : store.put(value);

            request.onsuccess = () => resolve();
            request.onerror = event => reject((event.target as IDBRequest).error);
        });
    }

    async get<T>(storeName: string, key: string): Promise<T | undefined> {
        return new Promise((resolve, reject) => {
            const transaction = this.createTransaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = event => reject((event.target as IDBRequest).error);
        });
    }

    async delete(storeName: string, key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.createTransaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = event => reject((event.target as IDBRequest).error);
        });
    }

    async getAll<T>(storeName: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const transaction = this.createTransaction(storeName, "readonly");
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = event => reject((event.target as IDBRequest).error);
        });
    }

    async deleteDatabase(): Promise<void> {
        this.close();
        return new Promise((resolve, reject) => {
            const request = indexedDB.deleteDatabase(this.dbName);

            request.onsuccess = () => resolve();
            request.onerror = event => reject((event.target as IDBRequest).error);
        });
    }

    async clear(storeName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const transaction = this.createTransaction(storeName, "readwrite");
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = event => reject((event.target as IDBRequest).error);
        });
    }

    close(): void {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}