export class ClickEvent {
    name: string;
    value: string;
    constructor(name: string, value: string) {
        this.name = name;
        this.value = value;
    }
    static OPEN_URL(value: string) { return new ClickEvent("open_url", value) }
    static RUN_COMMAND(value: string) { return new ClickEvent("run_command", value) }
    static SUGGEST_COMMAND(value: string) { return new ClickEvent("suggest_command", value) }
    static EAGLER_PLUGIN_DOWNLOAD(value: string) { return new ClickEvent("eagler_plugin_download", value) }
    static TWITCH_USER_INFO(value: string) { return new ClickEvent("twitch_user_info", value) }
    static RUN_CUSTOM(value: string) { return new ClickEvent("run_custom", value) }
}