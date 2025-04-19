import glassApiIcon from '../assets/icon.png';

if (typeof globalThis.ModAPI === 'undefined') {
    throw new Error("No ModAPI");
}

(async () => {
    const { GlassAPIF } = await import("./api/main");

    ModAPI.meta.title("GlassAPI");
    ModAPI.meta.version("v1.0.0");
    ModAPI.meta.description("GlassAPI is a mod that adds a new API to the game.");
    ModAPI.meta.credits("aleixdev");
    ModAPI.meta.icon(glassApiIcon);

    function startup() {
        GlassAPI.text._internals.initialize()
        ModAPI.events.callEvent("lib:glassapi:start",GlassAPI)
        GlassAPIF.require("text",globalThis,"G")
    }

    // @ts-ignore
    globalThis.GlassAPI = GlassAPIF;

    ModAPI.events.newEvent("lib:glassapi:init");
    ModAPI.events.newEvent("lib:glassapi:start");

    ModAPI.events.callEvent("lib:glassapi:init",GlassAPI)
    startup()
})();