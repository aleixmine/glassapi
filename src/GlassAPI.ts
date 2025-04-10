import glassApiIcon from '../assets/icon.png';

if (typeof globalThis.ModAPI === 'undefined') {
    throw new Error("No ModAPI");
}

(async () => {
    const { GlassAPI } = await import("./main");

    ModAPI.meta.title("GlassAPI");
    ModAPI.meta.version("v1.0.0");
    ModAPI.meta.description("GlassAPI is a mod that adds a new API to the game.");
    ModAPI.meta.credits("ALEIXMINE17");
    ModAPI.meta.icon(glassApiIcon);

    function startup() {
        const nmcg_GuiScreen_handleComponentClick = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage("net.minecraft.client.gui.GuiScreen", "handleComponentClick")];
        ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage("net.minecraft.client.gui.GuiScreen", "handleComponentClick")] = function (...args: { $getChatStyle: () => any; }[]) {
            console.log("xdxd",args)
            if (args[1]) {
                var style = args[1].$getChatStyle()
                var clickevent = style.$getChatClickEvent();
                console.log(clickevent)
                if (clickevent) {
                    var action = clickevent[ModAPI.util.getNearestProperty(clickevent, "$action")];
                    var type = ModAPI.util.jclStrToJsStr(action[ModAPI.util.getNearestProperty(action, "$canonicalName")])
                    var data = ModAPI.util.jclStrToJsStr(clickevent[ModAPI.util.getNearestProperty(clickevent, "$value")])
                    console.log("xdxdxd",type, data)
                    if (type === "run_custom") {
                        var func = GlassAPI.text._internals._customClickEvents.get(data);
                        if (func) {
                            func();
                            return 1;
                        }
                    }
                }
            }
            var guiHandleComponentClickResult = nmcg_GuiScreen_handleComponentClick.apply(this, args);
            return guiHandleComponentClickResult;
        }
    }

    startup()

    GlassAPI.text.registerCustomClickEvent(new GlassAPI.text.event.CustomClickEvent(()=>{
        console.log("Hello from custom click event")
        alert("Hello!")
    },"example_log_and_hello"))


    GlassAPI.text.Component.text("Hello")
        .clickEvent(GlassAPI.text.event.ClickEvent.RUN_CUSTOM("black_ui_and_hello"))


    // @ts-ignore
    globalThis.GlassAPI = GlassAPI;
})();