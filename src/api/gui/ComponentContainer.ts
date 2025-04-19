import { GuiButton } from "./components/GuiButton";
import { GuiLabel } from "./components/GuiLabel";
import { GuiTextField } from "./components/GuiTextField";

export class ComponentContainer {
    private buttonComponents: GuiButton[];
    private textFieldComponents: GuiTextField[];
    private labelComponents: GuiLabel[];

    constructor() {
        this.buttonComponents = [];
        this.textFieldComponents = [];
        this.labelComponents = [];
    }

    public addComponent(component: GuiButton | GuiLabel | GuiTextField): void {
        if (component instanceof GuiButton) {
            this.buttonComponents.push(component);
        } else if (component instanceof GuiTextField) {
            this.textFieldComponents.push(component);
        } else if (component instanceof GuiLabel) {
            this.labelComponents.push(component);
        }
    }

    public removeComponent(component: GuiButton | GuiLabel | GuiTextField): void {
        if (component instanceof GuiButton) {
            this.buttonComponents.filter(c => c.id !== component.id);
        } else if (component instanceof GuiTextField) {
            this.textFieldComponents.filter(c => c.id !== component.id);
        } else if (component instanceof GuiLabel) {
            this.labelComponents.filter(c => c.id !== component.id);
        }
    }

    public getButtonComponents(): GuiButton[] {
        return this.buttonComponents;
    }
    public getTextFieldComponents(): GuiTextField[] {
        return this.textFieldComponents;
    }
    public getLabelComponents(): GuiLabel[] {
        return this.labelComponents;
    }
}