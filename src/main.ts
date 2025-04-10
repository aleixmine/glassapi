// ./text/
import { Component } from "./text/Component";
import { TextComponent } from "./text/TextComponent";
import { TranslatableComponent } from "./text/TranslatableComponent";

// ./text/format
import { NamedTextColor } from "./text/format/NamedTextColor";
import { TextDecoration } from "./text/format/TextDecoration";

// ./text/event
import { ClickEvent } from "./text/event/ClickEvent";
import { HoverEvent } from "./text/event/HoverEvent";
import { DatabaseManager } from "./db/DatabaseManager";
import { IndexedDBStore } from "./db/IndexedDBStore";
import { FileSystemDB } from "./fs/FileSystemDB";
import { ResourcePacksFS } from "./fs/ResourcePacksFS";
import { WorldsFS } from "./fs/WorldsFS";
import { GuiScreenType } from "./gui/GuiScreenType";
import { GuiColor } from "./gui/GuiColor";
import { CustomClickEvent } from "./text/event/CustomClickEvent";

function isLikelyEnum(obj: any): boolean {
    if (typeof obj !== "object" || obj === null) return false;
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    return values.some(v => typeof v === "string" || typeof v === "number") &&
           keys.some(k => typeof obj[obj[k]] === "string" || typeof obj[obj[k]] === "number");
}

function exposeRecursively(obj: any, context: Record<string, any>) {
    if (typeof obj !== "object" || obj === null) return;

    for (const [key, value] of Object.entries(obj)) {
        if (context[key] !== undefined) continue; // evita sobrescribir
        if (typeof value === "object" && value !== null && !isLikelyEnum(value)) {
            exposeRecursively(value, context);
        } else {
            context[key] = value;
        }
    }
}

function gimport(modulePath: string, context: Record<string, any> = globalThis) {
    const parts = modulePath.split(".");
    let current: any = GlassAPI;

    for (const part of parts) {
        current = current?.[part];
        if (current === undefined) {
            throw new Error(`Module path "${modulePath}" is invalid at "${part}"`);
        }
    }

    if (typeof current === "object") {
        exposeRecursively(current, context);
    } else {
        const keyName = parts[parts.length - 1];
        context[keyName] = current;
    }
}

export const GlassAPI = {
    text: {
        _internals: {
            _customClickEvents: new Map<string, Function>()
        },
        registerCustomClickEvent: (event:CustomClickEvent)=>{
            GlassAPI.text._internals._customClickEvents.set(event.id, event.action);
        },
        format: {
            NamedTextColor,
            TextDecoration
        },
        event: {
            ClickEvent,
            HoverEvent,
            CustomClickEvent
        },
        Component,
        TextComponent,
        TranslatableComponent,
    },
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
        GuiColor
    },
    require: gimport
};