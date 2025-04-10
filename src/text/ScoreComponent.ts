import { StyleComponent } from "./StyleComponent";

const JavaString = ModAPI.util.str;

const ChatComponentText = ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentText").constructors[0];
const ChatComponentScore = ModAPI.reflect.getClassById("net.minecraft.util.ChatComponentScore").constructors[0];

export class ScoreComponent extends StyleComponent {
    name: string;
    objective: string;

    constructor(name: string, objective: string) {
        super();
        this.name = name;
        this.objective = objective;
    }

    build() {
        let messageStyle = this.getStyle();
        let result;
        if(this.siblings.length > 0) {
            result = ChatComponentText(JavaString(""));
            let message = ChatComponentScore(JavaString(this.name),JavaString(this.objective));
            message.$setChatStyle(messageStyle);
            result.$appendSibling(message);
            for (let sibling of this.siblings) {
                result.$appendSibling(sibling.build());
            }
        } else {
            result = ChatComponentScore(JavaString(this.name),JavaString(this.objective));
            result.$setChatStyle(messageStyle);
        }
        return result;
    }
}