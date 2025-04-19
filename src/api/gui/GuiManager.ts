import { ComponentContainer } from "./ComponentContainer";
import { GuiButton } from "./components/GuiButton";
import { GuiLabel } from "./components/GuiLabel";
import { GuiTextField } from "./components/GuiTextField";
import { GuiScreenType } from "./GuiScreenType";

const I18n = ModAPI.reflect.getClassById("net.minecraft.client.resources.I18n");

export class GuiManager {
    private screens: Map<string, ComponentContainer>;

    constructor() {
        this.screens = new Map();
    }

    addScreen(screenName: GuiScreenType, component: GuiButton | GuiLabel | GuiTextField) {
        if (!this.screens.has(screenName)) {
            this.screens.set(screenName, new ComponentContainer())
        }
        this.screens.get(screenName)!.addComponent(component);
    }


    build() {
        for (const [screenName, componentContainer] of this.screens) {

            const guiInit = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "initGui")];
            ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "initGui")] = function (...args: any[]) {
                var originalResult = guiInit.apply(this, args);
                componentContainer.getButtonComponents().forEach(btn => {
                    args[0].$buttonList.$add(btn.toJava());
                })
                var fontRendererObjName = ModAPI.util.getNearestProperty(args[0], "$fontRendererObj");
                var fontRendererObj = args[0][fontRendererObjName];
                componentContainer.getTextFieldComponents().forEach(tfd => {
                    args[0]["tfd-"+tfd.id] = tfd.toJava(fontRendererObj);
                })
                return originalResult;
            }

            const guiActionPerformed = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "actionPerformed")];
            ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "actionPerformed")] = function (...args: any[]) {
                var originalResult = guiActionPerformed.apply(this, args);
                var idProp = ModAPI.util.getNearestProperty(args[1], "$id");
                componentContainer.getButtonComponents().forEach(btn => {
                    if(args[1] && args[1][idProp] === btn.id) {
                        if(typeof btn.action === "function") {
                            btn.action(btn);
                        }
                    }
                })
                return originalResult;
            }

            const guiDrawScreen = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "drawScreen")];
            ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "drawScreen")] = function (...args: any[]) {
                var originalResult = guiDrawScreen.apply(this, args);
                componentContainer.getTextFieldComponents().forEach(tfd => {
                    args[0]["tfd-"+tfd.id].$drawTextBox()
                })
                var fontRendererObjName = ModAPI.util.getNearestProperty(args[0], "$fontRendererObj");
                var fontRendererObj = args[0][fontRendererObjName];
                componentContainer.getLabelComponents().forEach(lbl => {
                    args[0].$drawString(
                        fontRendererObj,
                        I18n.staticMethods["format"].method(ModAPI.util.str(lbl.text)),
                        lbl.x,
                        lbl.y,
                        lbl.color.getColorValue()
                    )
                })
                return originalResult;
            }

            const guiUpdateScreen = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "updateScreen")];
            ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "updateScreen")] = function (...args: any[]) {
                var originalResult = guiUpdateScreen.apply(this, args);
                componentContainer.getTextFieldComponents().forEach(tfd => {
                    args[0]["tfd-"+tfd.id].$updateCursorCounter()
                })
                return originalResult;
            }

            const guiKeyTyped = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "keyTyped")];
            ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "keyTyped")] = function (...args: any[]) {
                var originalResult = guiKeyTyped.apply(this, args);
                componentContainer.getTextFieldComponents().forEach(tfd => {
                    args[0]["tfd-"+tfd.id].$textboxKeyTyped(args[1], args[2]);
                })
                return originalResult;
            }

            const guiMouseClicked = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "mouseClicked")];
            ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "mouseClicked")] = function (...args: any[]) {
                var originalResult = guiMouseClicked.apply(this, args);
                componentContainer.getTextFieldComponents().forEach(tfd => {
                    args[0]["tfd-"+tfd.id].$mouseClicked(args[1], args[2],args[3]);
                })
                return originalResult;
            }

            const guiBlockPTTKey = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "blockPTTKey")];
            ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "blockPTTKey")] = function (...args: any[]) {
                const originalResult = guiBlockPTTKey.apply(this, args);
                let isAnyTextFieldFocused = false;
                componentContainer.getTextFieldComponents().forEach(tfd => {
                    const textField = args[0]["tfd-" + tfd.id];
                    if (textField && textField.$isFocused()) {
                        isAnyTextFieldFocused = true;
                    }
                });
                return originalResult || isAnyTextFieldFocused;
            };

            const guiShowCopyPasteButtons = ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "showCopyPasteButtons")];
            ModAPI.hooks.methods[ModAPI.util.getMethodFromPackage(screenName, "showCopyPasteButtons")] = function (...args: any[]) {
                const originalResult = guiShowCopyPasteButtons.apply(this, args);
                let isAnyTextFieldFocused = false;
                componentContainer.getTextFieldComponents().forEach(tfd => {
                    const textField = args[0]["tfd-" + tfd.id];
                    if (textField && textField.$isFocused()) {
                        isAnyTextFieldFocused = true;
                    }
                });
                return originalResult || isAnyTextFieldFocused;
            };
        }
    }
}



