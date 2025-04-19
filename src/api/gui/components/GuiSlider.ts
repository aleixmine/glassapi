export class GuiSlider {

    static JavaGuiSlider2: any = ModAPI.reflect.getClassById("net.lax1dude.eaglercraft.v1_8.sp.gui.GuiSlider2").constructors.filter(c => { return c.length === 7 })[0];

    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    value: number;
    maxValue: number;

    constructor (id:number, x:number, y:number, width:number=150, height:number=20, value:number, maxValue:number) {
        this.id=id;
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.value=value;
        this.maxValue=maxValue;
    }

    toJava() {
        return GuiSlider.JavaGuiSlider2(this.id, this.x, this.y, this.width, this.height, this.value, this.maxValue);
    }
}