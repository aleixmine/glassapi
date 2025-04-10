export class HoverEvent {
    name: string;
    value: string;
    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
    static SHOW_TEXT(value: string) { return new HoverEvent("show_text", value) }
    static SHOW_ACHIEVEMENT(value: string) { return new HoverEvent("show_achievement", value) }
    static SHOW_ITEM(value: string) { return new HoverEvent("show_item", value) }
    static SHOW_ENTITY(value: string) { return new HoverEvent("show_entity", value) }
}