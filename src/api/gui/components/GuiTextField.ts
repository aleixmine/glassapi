export class GuiTextField {

    static JavaGuiTextField: any = ModAPI.reflect.getClassById("net.minecraft.client.gui.GuiTextField").constructors.filter(c => { return c.length === 6 })[0];

    id: number;
    x: number;
    y: number;
    width: number;
    height: number;

    constructor (id:number, x:number, y:number, width:number, height:number ) {
        this.id=id;
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }

    toJava(fontRenderer:any) {
        return GuiTextField.JavaGuiTextField(this.id,fontRenderer, this.x, this.y, this.width, this.height);
    }
}