import { StyleComponent } from "./StyleComponent";

const JavaString = ModAPI.util.str;

const ChatComponentText = ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0];

export class TextComponent extends StyleComponent {
    content: string;

    constructor(content: string = "") {
        super();
        this.content = content;
    }

    build() {
        let messageStyle = this.getStyle();
        let result;
        if(this.siblings.length > 0) {
            result = ChatComponentText(JavaString(""));
            let message = ChatComponentText(JavaString(this.content));
            message.$setChatStyle(messageStyle);
            result.$appendSibling(message);
            for (let sibling of this.siblings) {
                result.$appendSibling(sibling.build())
            }
        } else {
            result = ChatComponentText(JavaString(this.content))
            result.$setChatStyle(messageStyle);
        }
        return result;
    }
}