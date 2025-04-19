// ./text/
import { Component } from "./Component";
import { TextComponent } from "./TextComponent";
import { TranslatableComponent } from "./TranslatableComponent";

// ./text/format
import { NamedTextColor } from "./format/NamedTextColor";
import { TextDecoration } from "./format/TextDecoration";

// ./text/event
import { ClickEvent } from "./event/ClickEvent";
import { HoverEvent } from "./event/HoverEvent";
import { CustomClickEvent } from "./event/CustomClickEvent";
import { ScoreComponent } from "./ScoreComponent";
import { SelectorComponent } from "./SelectorComponent";
import { StyleComponent } from "./StyleComponent";
import { CustomHoverEvent } from "./event/CustomHoverEvent";

function initialize() {
    const nmcg_GuiScreen_handleComponentClick = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage("net.minecraft.client.gui.GuiScreen", "handleComponentClick")];
    ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage("net.minecraft.client.gui.GuiScreen", "handleComponentClick")] = function (...args: { $getChatStyle: () => any; }[]) {
        /// args[0] -> GuiScreen - args[1] -> ChatComponent ///
        if (!args[1]) {
            return 0;
        }
        if (ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage("net.minecraft.client.gui.GuiScreen", "isShiftKeyDown")]()) {
            var guiHandleComponentClickResult = nmcg_GuiScreen_handleComponentClick.apply(this, args);
            return guiHandleComponentClickResult;
        }
        var chatComponent = ModAPI.util.wrap(args[1]);
        var chatStyle = chatComponent.getChatStyle();
        var clickEvent = chatStyle.getChatClickEvent();
        if (!clickEvent) {
            return 0;
        }
        var clickEventAction=clickEvent.getAction();
        var action = ModAPI.util.ustr(clickEventAction.name().getRef()).toUpperCase();
        var value = ModAPI.util.ustr(clickEvent[ModAPI.util.getNearestProperty(clickEvent,"value")].getRef())

        clickEvent[ModAPI.util.getNearestProperty(clickEvent,"value")].getRef()
        if (action==="RUN_CUSTOM") {
            if (GlassAPI.text._internals._customClickEvents.has(value)) {
                GlassAPI.text._internals._customClickEvents.get(value)!(ModAPI.util.wrap(args[0]),chatComponent);
            }
            return 1;
        }
        var guiHandleComponentClickResult = nmcg_GuiScreen_handleComponentClick.apply(this, args);
        return guiHandleComponentClickResult;
    }
    
    const nmcg_GuiScreen_handleComponentHover = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage("net.minecraft.client.gui.GuiScreen", "handleComponentHover")];
    ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage("net.minecraft.client.gui.GuiScreen", "handleComponentHover")] = function (...args: { $getChatStyle: () => any; }[]) {
        /// args[0] -> GuiScreen - args[1] -> ChatComponent ///
        /// args[2] -> mouse_x - args[3] -> mouse_y ///
        if (!args[1]) {
            return;
        }
        var chatComponent = ModAPI.util.wrap(args[1]);
        var chatStyle = chatComponent.getChatStyle();
        var hoverEvent = chatStyle.getChatHoverEvent();
        if (!hoverEvent) {
            return;
        }
        var actionName=ModAPI.util.ustr(hoverEvent.getAction().name().getRef()).toUpperCase();
        var value=ModAPI.util.ustr(hoverEvent.getValue().getUnformattedText().getRef());
        if (actionName==="SHOW_CUSTOM") {
            if (GlassAPI.text._internals._customHoverEvents.has(value)) {
                GlassAPI.text._internals._customHoverEvents.get(value)!(ModAPI.util.wrap(args[0]),chatComponent,args[2],args[3]);
            }
            ModAPI.reflect.getClassById("net.lax1dude.eaglercraft.v1_8.opengl.GlStateManager").staticMethods.disableLighting.method()
            return;
        }
        var guiHandleComponentHoverResult = nmcg_GuiScreen_handleComponentHover.apply(this, args);
        return guiHandleComponentHoverResult;
    }
}

let text = {
    _internals: {
        _customClickEvents: new Map<string, Function>(),
        _customHoverEvents: new Map<string, Function>(),
        initialize
    },
    customEvents: {
        registerCustomEvent: function (event: CustomClickEvent | CustomHoverEvent) {
            if (event instanceof CustomHoverEvent)
                GlassAPI.text._internals._customHoverEvents.set(event.id, event.action);
            else if (event instanceof CustomClickEvent) 
                GlassAPI.text._internals._customClickEvents.set(event.id, event.action);
            else {
                console.error("Invalid event type");
                return;
            }
        },
        unregisterCustomEvent: function (event_id: string) {
            GlassAPI.text._internals._customClickEvents.delete(event_id);
            GlassAPI.text._internals._customHoverEvents.delete(event_id);
        }
    },
    
    Component,
    StyleComponent,
    // CLIENT
    TextComponent,
    TranslatableComponent,
    // SERVER
    ScoreComponent,
    SelectorComponent,

    format: {
        NamedTextColor, 
        TextDecoration
    },

    event: {
        ClickEvent, 
        HoverEvent, 
        CustomClickEvent,
        CustomHoverEvent
    }
}

export default text;