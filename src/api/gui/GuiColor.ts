export class GuiColor {
    private red: number = 1.0;
    private green: number = 1.0;
    private blue: number = 1.0;
    private alpha: number = 1.0;

    constructor(color: number = 0xFFFFFFFF) {
        this.setColor(color);
    }

    public setColor(color: number): void {
        if ((color & 0xFF000000) === 0) {
            color |= 0xFF000000;
        }

        this.red = ((color >> 16) & 0xFF) / 255.0;
        this.green = ((color >> 8) & 0xFF) / 255.0;
        this.blue = (color & 0xFF) / 255.0;
        this.alpha = ((color >> 24) & 0xFF) / 255.0;
    }

    public static from(red: number, green: number, blue: number, alpha: number = 255): GuiColor {
        const color = new GuiColor();
        color.setRed(red / 255.0);
        color.setGreen(green / 255.0);
        color.setBlue(blue / 255.0);
        color.setAlpha(alpha / 255.0);
        return color;
    }

    public applyDropShadow(): void {
        const colorValue = this.getColorValue();
        const shadowColor = ((colorValue & 0xFCFCFC) >> 2) | (colorValue & 0xFF000000);
        this.setColor(shadowColor);
    }

    public getColorValue(): number {
        return (
            (Math.round(this.alpha * 255) << 24) |
            (Math.round(this.red * 255) << 16) |
            (Math.round(this.green * 255) << 8) |
            Math.round(this.blue * 255)
        );
    }

    public getRed(): number { return this.red; }
    public getGreen(): number { return this.green; }
    public getBlue(): number { return this.blue; }
    public getAlpha(): number { return this.alpha; }

    public setRed(value: number): void { this.red = Math.max(0, Math.min(1, value)); }
    public setGreen(value: number): void { this.green = Math.max(0, Math.min(1, value)); }
    public setBlue(value: number): void { this.blue = Math.max(0, Math.min(1, value)); }
    public setAlpha(value: number): void { this.alpha = Math.max(0, Math.min(1, value)); }

}