import { StyleComponent } from "./StyleComponent";

const JavaString = ModAPI.util.str;
const JavaList = (list:string[]) => ModAPI.hooks._teavm.$rt_createArrayFromData("java.util.List",list.map(arg => JavaString(arg)))

const ChatComponentText = ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0];
const ChatComponentTranslation = ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentTranslation").constructors[0];

export class TranslatableComponent extends StyleComponent {
    translationKey: string;
    args: string[];

    constructor(translationKey: string, ...args: string[]) {
        super();
        this.translationKey = translationKey;
        this.args = args;
    }

    build() {
        let messageStyle = this.getStyle();
        let result;
        if(this.siblings.length > 0) {
            result = ChatComponentText(JavaString(""));
            let message = ChatComponentTranslation(JavaString(this.translationKey), JavaList(this.args));
            message.$setChatStyle(messageStyle);
            result.$appendSibling(message);
            for (let sibling of this.siblings) {
                result.$appendSibling(sibling.build())
            }
        } else {
            result = ChatComponentTranslation(JavaString(this.translationKey), JavaList(this.args));
            result.$setChatStyle(messageStyle);
        }
        return result;
    }
}