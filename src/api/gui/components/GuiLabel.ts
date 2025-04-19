import { GuiColor } from "../GuiColor";

export class GuiLabel {

    id: number;
    x: number;
    y: number;
    text: string;
    color: GuiColor;

    constructor (id:number, x:number, y:number, text:string, color:GuiColor) {
        this.id=id;
        this.x=x;
        this.y=y;
        this.text=text;
        this.color=color;
    }
}