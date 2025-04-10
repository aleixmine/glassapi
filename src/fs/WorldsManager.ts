import { FileSystemDB } from "./FileSystemDB";
import { WorldsListController } from "./WorldsListController";

export class WorldsManager {
    private list: WorldsListController;
    
    constructor(fs: FileSystemDB) {
        this.list = new WorldsListController(fs);
    }

    async add(name: string, fileBytes: ArrayBuffer): Promise<void> {
        // Future implementation
        console.log(this.list,name,fileBytes)
    }
}