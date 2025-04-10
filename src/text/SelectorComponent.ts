import { StyleComponent } from "./StyleComponent";

const JavaString = ModAPI.util.str;

const ChatComponentText = ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0];
const ChatComponentSelector = ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentSelector").constructors[0];

export class SelectorComponent extends StyleComponent {
    selector: string;

    constructor(selector: string) {
        super();
        this.selector = selector;
    }

    build() {
        let messageStyle = this.getStyle();
        let result;
        if(this.siblings.length > 0) {
            result = ChatComponentText(JavaString(""));
            let message = ChatComponentSelector(JavaString(this.selector));
            message.$setChatStyle(messageStyle);
            result.$appendSibling(message);
            for (let sibling of this.siblings) {
                result.$appendSibling(sibling.build())
            }
        } else {
            result = ChatComponentSelector(JavaString(this.selector));
            result.$setChatStyle(messageStyle);
        }
        return result;
    }
}