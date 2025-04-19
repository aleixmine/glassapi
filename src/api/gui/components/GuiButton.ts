export class GuiButton {

    static JavaGuiButton: any = ModAPI.reflect.getClassById("net.minecraft.client.gui.GuiButton").constructors.filter(c => { return c.length === 6 })[0];

    id: number;
    x: number;
    y: number;
    text: string;
    width: number;
    height: number;
    action: (arg1: GuiButton) => void | null;

    constructor (id:number, x:number, y:number, text:string, action:(arg1: GuiButton)=>void | null, width:number=200, height:number=20) {
        this.id=id;
        this.x=x;
        this.y=y;
        this.text=text;
        this.width=width;
        this.height=height;
        this.action=action;
    }

    toJava() {
        return GuiButton.JavaGuiButton(this.id, this.x, this.y, this.width, this.height, ModAPI.util.str(this.text));
    }
}