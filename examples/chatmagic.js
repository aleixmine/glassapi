/// <reference types="../src/GlassAPI.d.ts" />
/// <reference types="../src/ModAPI.d.ts" />

ModAPI.meta.title("GlassAPI - Example Mod Magic");
ModAPI.meta.version("v1.0.0");
ModAPI.meta.description("A mod that showcases interactive chat features using GlassAPI.");
ModAPI.meta.credits("aleixdev");

ModAPI.addEventListener("lib:glassapi:init",g=>{
    console.log("GlassAPI Initialized!")
})

ModAPI.addEventListener("lib:glassapi:start",g=>{
    console.log("GlassAPI Started!")
})

ModAPI.addEventListener("sendchatmessage",e=>{
    if (e.message!=="magic") return;

    // Decoration shortcuts to modify states of the text component.

    let text_state = GComponent.text("state")
        .bold(true)
        .italic(true)
        .obfuscated(true)
        .underlined(true)
        .strikethrough(true)
        .append(new GTextComponent("Example"))
    
    // Decorations manually
    text_state
        .decoration(GTextDecoration.OBFUSCATED,false)

    // Adding hover and click events
    let reactive_text = GComponent.text("magic")
        .clickEvent(GClickEvent.RUN_COMMAND("/say I like magic"))
        .hoverEvent(GHoverEvent.SHOW_TEXT("Magic is cool"))
    
    // Different ChatComponents

    // Client side
    let chat_text = GComponent.text("Text"); // or GTextComponent
    let chat_translatable = GComponent.translatable("tile.bed.notSafe"); // or GTranslatableComponent
    // Server side (needs to be processed)
    let chat_selector = GComponent.selector("@a");  // or GSelectorComponent
    let chat_score = GComponent.score("Player0","deaths"); // or GScoreComponent
    
    // Custom click events
    GlassAPI.text.customEvents.registerCustomEvent(new GCustomClickEvent((gui,chatComponent)=>{
        alert("Magic!")
    },"magic"))

    let custom_click = GComponent.text("Click this for alert!")
        .clickEvent(GClickEvent.RUN_CUSTOM("magic"))
    
    // Custom hover events
    GlassAPI.text.customEvents.registerCustomEvent(new GCustomHoverEvent((gui,chatComponent,x,y)=>{
        let list = "Hello\nworld".split("\n")
        let raw_list = ModAPI.array.object("java.util.Array",list.map(arg => ModAPI.util.str(arg)));
        let jlist = ModAPI.reflect.getClassById("java.util.ArrayList").constructors[0]();
        jlist.$array1=raw_list;
        jlist.$size0=2;
        gui.drawHoveringText(jlist, x, y);
    },"world"))

    let custom_hover = GComponent.text("Hover this for hello!")
        .hoverEvent(GHoverEvent.SHOW_CUSTOM("world"))
    
    // Append every chat component
    let result = new GTextComponent()
        .append(text_state)
        .append(new GTextComponent(" "))
        .append(chat_text)
        .append(new GTextComponent(" "))
        .append(chat_translatable)
        .append(new GTextComponent(" "))
        .append(reactive_text)
        .append(new GTextComponent(" "))
        .append(custom_click)
        .append(new GTextComponent(" "))
        .append(custom_hover);

    ModAPI.hooks.methods["nmcg_GuiNewChat_printChatMessage"](
        ModAPI.javaClient.$ingameGUI.$persistantChatGUI,
        result.build()
    );
})
