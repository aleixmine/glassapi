export class NamedTextColor {
    name: string;
    value: number;
    code: string;

    constructor(name: string, value: number, code: string) {
        this.name = name;
        this.value = value;
        this.code = code;
    }

    static BLACK = new NamedTextColor("black", 0x000000, "0");
    static DARK_BLUE = new NamedTextColor("dark_blue", 0x0000aa, "1");
    static DARK_GREEN = new NamedTextColor("dark_green", 0x00aa00, "2");
    static DARK_AQUA = new NamedTextColor("dark_aqua", 0x00aaaa, "3");
    static DARK_RED = new NamedTextColor("dark_red", 0xaa0000, "4");
    static DARK_PURPLE = new NamedTextColor("dark_purple", 0xaa00aa, "5");
    static GOLD = new NamedTextColor("gold", 0xffaa00, "6");
    static GRAY = new NamedTextColor("gray", 0xaaaaaa, "7");
    static DARK_GRAY = new NamedTextColor("dark_gray", 0x555555, "8");
    static BLUE = new NamedTextColor("blue", 0x5555ff, "9");
    static GREEN = new NamedTextColor("green", 0x55ff55, "a");
    static AQUA = new NamedTextColor("aqua", 0x55ffff, "b");
    static RED = new NamedTextColor("red", 0xff5555, "c");
    static LIGHT_PURPLE = new NamedTextColor("light_purple", 0xff55ff, "d");
    static YELLOW = new NamedTextColor("yellow", 0xffff55, "e");
    static WHITE = new NamedTextColor("white", 0xffffff, "f");
}