import { ClickEvent } from "./event/ClickEvent";
import { HoverEvent } from "./event/HoverEvent";
import { NamedTextColor } from "./format/NamedTextColor";
import { TextDecoration } from "./format/TextDecoration";
import { ScoreComponent } from "./ScoreComponent";
import { SelectorComponent } from "./SelectorComponent";

import { TextComponent } from "./TextComponent";
import { TranslatableComponent } from "./TranslatableComponent";

const JavaString = ModAPI.util.str;

const ChatComponentText = ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0];
const EnumChatFormatting = ModAPI.reflect.getClassById("net.minecraft.util.EnumChatFormatting").staticVariables;
const ChatStyle = ModAPI.reflect.getClassById("net.minecraft.util.ChatStyle").constructors[0];

const ChatClickEvent = ModAPI.reflect.getClassById("net.minecraft.event.ClickEvent").constructors[0];
const ClickEventAction = ModAPI.reflect.getClassById("net.minecraft.event.ClickEvent$Action");
const ChatHoverEvent = ModAPI.reflect.getClassById("net.minecraft.event.HoverEvent").constructors[0];
const HoverEventAction = ModAPI.reflect.getClassById("net.minecraft.event.HoverEvent$Action").staticVariables;

const ClickEventActionCustom = ClickEventAction.constructors[0](ModAPI.util.str("run_custom"),6,ModAPI.util.str("run_custom"),1);

export class StyleComponent {
    siblings: (TextComponent | TranslatableComponent | ScoreComponent | SelectorComponent)[];
    style: { color: string; strikethrough: boolean; italic: boolean; bold: boolean; obfuscated: boolean; underlined: boolean; };
    event: { insertion: string; click: ClickEvent | null; hover: HoverEvent | null; };

    constructor() {
        this.siblings = [];
        this.style = {
            color: "",
            strikethrough: false,
            italic: false,
            bold: false,
            obfuscated: false,
            underlined: false
        }
        this.event = {
            insertion: "",
            click: null,
            hover: null
        }
    }

    color(color: NamedTextColor) {
        this.style.color = color.name.toUpperCase();
        return this;
    }

    strikethrough(state: boolean) {
        this.style.strikethrough = state;
        return this;
    }
    bold(state: boolean) {
        this.style.bold = state;
        return this;
    }
    italic(state: boolean) {
        this.style.italic = state;
        return this;
    }
    obfuscated(state: boolean) {
        this.style.obfuscated = state;
        return this;
    }
    underlined(state: boolean) {
        this.style.underlined = state;
        return this;
    }
    insertion(content: string) {
        this.event.insertion = content;
        return this;
    }
    clickEvent(event: ClickEvent) {
        this.event.click = event;
        return this;
    }
    hoverEvent(event: HoverEvent) {
        this.event.hover = event;
        return this;
    }
    append(styleComponent: TextComponent | TranslatableComponent | ScoreComponent | SelectorComponent) {
        this.siblings.push(styleComponent);
        return this;
    }
    decoration(decoration: TextDecoration, state: boolean) {
        switch (decoration) {
            case TextDecoration.BOLD:
                this.bold(state);
                break;
            case TextDecoration.ITALIC:
                this.italic(state);
                break
            case TextDecoration.OBFUSCATED:
                this.obfuscated(state);
                break;
            case TextDecoration.STRIKETHROUGH:
                this.strikethrough(state);
                break;
            case TextDecoration.UNDERLINED:
                this.underlined(state);
                break;
        }
        return this;
    }

    getStyle() {
        let messageStyle = ChatStyle();
        if (this.style.color) messageStyle.$color2 = EnumChatFormatting[this.style.color];

        if (this.style.bold) messageStyle.$bold = 1;
        if (this.style.italic) messageStyle.$italic = 1;
        if (this.style.strikethrough) messageStyle.$strikethrough = 1;
        if (this.style.underlined) messageStyle.$underlined = 1;
        if (this.style.obfuscated) messageStyle.$obfuscated = 1;

        if (this.event.insertion) messageStyle.$insertion = JavaString(this.event.insertion);
        if (this.event.click) {
            let actionName=this.event.click.name.toUpperCase();
            let action=null;
            if (actionName==="RUN_CUSTOM") {
                action=ClickEventActionCustom
            } else {
                action=ClickEventAction.staticVariables[actionName]
            }
            messageStyle.$chatClickEvent = ChatClickEvent(action, JavaString(this.event.click.value))
        }
        if (this.event.hover) messageStyle.$chatHoverEvent = ChatHoverEvent(HoverEventAction[this.event.hover.name.toUpperCase()], ChatComponentText(JavaString(this.event.hover.value)))

        return messageStyle;
    }
}