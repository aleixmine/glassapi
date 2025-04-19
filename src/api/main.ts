import * as textf from "./text/main";

import { DatabaseManager } from "./db/DatabaseManager";
import { IndexedDBStore } from "./db/IndexedDBStore";
import { FileSystemDB } from "./fs/FileSystemDB";
import { ResourcePacksFS } from "./fs/ResourcePacksFS";
import { WorldsFS } from "./fs/WorldsFS";
import { GuiScreenType } from "./gui/GuiScreenType";
import { GuiColor } from "./gui/GuiColor";
import { GuiManager } from "./gui/GuiManager";
import { GuiButton } from "./gui/components/GuiButton";
import { GuiLabel } from "./gui/components/GuiLabel";
import { GuiTextField } from "./gui/components/GuiTextField";
import { ComponentContainer } from "./gui/ComponentContainer";
import { GlassLogger } from "./util/GlassLogger";

function isLikelyEnum(obj: any): boolean {
    if (typeof obj !== "object" || obj === null) return false;
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    return values.some(v => typeof v === "string" || typeof v === "number") &&
           keys.some(k => typeof obj[obj[k]] === "string" || typeof obj[obj[k]] === "number");
}

function exposeRecursively(obj: any, context: Record<string, any>, prefix:string) {
    if (typeof obj !== "object" || obj === null) return;

    for (const [key, value] of Object.entries(obj)) {
        if (context[key] !== undefined) continue;
        if (typeof value === "object" && value !== null && !isLikelyEnum(value)) {
            exposeRecursively(value, context, prefix);
        } else {
            context[prefix+key] = value;
        }
    }
}

function gimport(modulePath: string, context: Record<string, any> = globalThis, prefix:string="") {
    const parts = modulePath.split(".");
    let current: any = GlassAPI;

    for (const part of parts) {
        current = current?.[part];
        if (current === undefined) {
            throw new Error(`Module path "${modulePath}" is invalid at "${part}"`);
        }
    }

    if (typeof current === "object") {
        exposeRecursively(current, context, prefix);
    } else {
        const keyName = parts[parts.length - 1];
        context[prefix+keyName] = current;
    }
}

export const GlassAPIF = {
    text: textf.default,
    db: {
        DatabaseManager,
        IndexedDBStore,
    },
    fs: {
        FileSystemDB,
        ResourcePacksFS,
        WorldsFS
    },
    gui: {
        GuiScreenType,
        GuiColor,
        GuiManager,
        ComponentContainer,
        components: {
            GuiButton,
            GuiLabel,
            GuiTextField
        }
    },
    require: gimport,
    logger: new GlassLogger({ appName: 'GlassAPI' })
};