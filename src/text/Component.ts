import { ScoreComponent } from "./ScoreComponent";
import { SelectorComponent } from "./SelectorComponent";
import { TextComponent } from "./TextComponent";
import { TranslatableComponent } from "./TranslatableComponent";

export class Component {
    static text(content: string) {
        return new TextComponent(content)
    }
    static score(name: string, objective: string) {
       return new ScoreComponent(name, objective)
    }
    static selector(selector: string) {
       return new SelectorComponent(selector)
    }
    static translatable(translationKey: string, ...args: string[]) {
        return new TranslatableComponent(translationKey, ...args)
    }
}