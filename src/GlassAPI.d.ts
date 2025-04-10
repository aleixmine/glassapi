declare namespace GlassAPI {
  namespace text {
    namespace format {
      class NamedTextColor {
        name: string;
        value: number;
        code: string;

        constructor(name: string, value: number, code: string);
        static BLACK: NamedTextColor;
        static DARK_BLUE: NamedTextColor;
        static DARK_GREEN: NamedTextColor;
        static DARK_AQUA: NamedTextColor;
        static DARK_RED: NamedTextColor;
        static DARK_PURPLE: NamedTextColor;
        static GOLD: NamedTextColor;
        static GRAY: NamedTextColor;
        static DARK_GRAY: NamedTextColor;
        static BLUE: NamedTextColor;
        static GREEN: NamedTextColor;
        static AQUA: NamedTextColor;
        static RED: NamedTextColor;
        static LIGHT_PURPLE: NamedTextColor;
        static YELLOW: NamedTextColor;
        static WHITE: NamedTextColor;
      }
      enum TextDecoration {
        BOLD,
        ITALIC,
        STRIKETHROUGH,
        UNDERLINED,
        OBFUSCATED
      }
    }
    namespace event {
      class ClickEvent {
        name: string;
        value: string;

        constructor(name: string, value: string);
        static OPEN_URL: ClickEvent;
        static RUN_COMMAND: ClickEvent;
        static SUGGEST_COMMAND: ClickEvent;
        static EAGLER_PLUGIN_DOWNLOAD: ClickEvent;
        static TWITCH_USER_INFO: ClickEvent;
      }
      class HoverEvent {
        name: string;
        value: string;

        constructor(name: string, value: string);
        static SHOW_TEXT: HoverEvent;
        static SHOW_ACHIEVEMENT: HoverEvent;
        static SHOW_ITEM: HoverEvent;
        static SHOW_ENTITY: HoverEvent;
      }
    }
    class StyleComponent {
      siblings: (TextComponent | TranslatableComponent)[];
      style: { color: string; strikethrough: boolean; italic: boolean; bold: boolean; obfuscated: boolean; underlined: boolean; };
      event: { insertion: string; click: GlassAPI.text.event.ClickEvent | null; hover: GlassAPI.text.event.HoverEvent | null; };

      constructor();
      color(color: format.NamedTextColor): StyleComponent;
      strikethrough(state: boolean): StyleComponent;
      bold(state: boolean): StyleComponent;
      italic(state: boolean): StyleComponent;
      obfuscated(state: boolean): StyleComponent;
      underlined(state: boolean): StyleComponent;
      insertion(content: string): StyleComponent;
      clickEvent(event: event.ClickEvent): StyleComponent;
      hoverEvent(event: event.HoverEvent): StyleComponent;
      decoration(decoration: format.TextDecoration, state: boolean): StyleComponent;
      append(styleComponent: TextComponent | TranslatableComponent): StyleComponent;
      getStyle(): any;
    }
    class TextComponent extends StyleComponent {
      content: string;
      constructor(content: string);

      build(): any;
    }
    class TranslatableComponent extends StyleComponent {
      translationKey: string;
      args: string[];

      constructor(translationKey: string, ...args: string[]);

      build(): any;
    }
    class Component {
      static text(content: string): TextComponent;
      //static score(name: string, objective: string): ScoreComponent;
      //static selector(selector: string): SelectorComponent;
      static translatable(translationKey: string, ...args: string[]): TranslatableComponent;
    }
  }
  namespace db {
    class DatabaseManager {
      private db: IDBDatabase | null;
      private dbName: string;
      private dbVersion: number;
      private onUpgrade?: (db: IDBDatabase) => void;

      constructor(
        dbName: string,
        dbVersion: number,
        onUpgrade?: (db: IDBDatabase) => void
      );

      private ensureDBOpen(): void;
      private createTransaction(storeNames: string | string[], mode: IDBTransactionMode): IDBTransaction;

      open(): Promise<IDBDatabase>;
      set<T>(storeName: string, value: T, key?: string): Promise<void>;
      get<T>(storeName: string, key: string): Promise<T | undefined>;
      delete(storeName: string, key: string): Promise<void>;
      getAll<T>(storeName: string): Promise<T[]>;
      deleteDatabase(): Promise<void>;
      clear(storeName: string): Promise<void>;
      close(): void;
    }
    class IndexedDBStore {
      private dbManager: DatabaseManager;
      private storeName: string;

      constructor(dbManager: DatabaseManager, storeName: string);

      set<T>(value: T, key?: string): Promise<void>;
      get<T>(key: string): Promise<T | undefined>;
      delete(key: string): Promise<void>;
      clear(): Promise<void>;
      getAll<T>(): Promise<T[]>;
    }
  }
  namespace fs {
    interface BasicFile {
      path: string;
      data: any;
    }
    class FileSystemDB {
      private dbStore: db.IndexedDBStore;

      constructor(dbStore: db.IndexedDBStore);

      setFile(path: string, data: any): Promise<void>;
      getFile(path: string): Promise<BasicFile | null>;
      deleteFile(path: string): Promise<void>;
      renameFile(oldPath: string, newPath: string): Promise<void>;
      fileExists(path: string): Promise<boolean>;
      setDirectory(path: string): Promise<void>;
      deleteDirectory(path: string): Promise<void>;
      listDirectory(path: string): Promise<BasicFile[]>;
    }
  }
  namespace epk {
    class EPKCompiler {
      fileType: string;
      fileName: string;
      comment: string;
      version: string;
      bufferWriter: util.Uint8Writer;
      textEncoder: TextEncoder;

      constructor(fileType: string, fileName: string, comment?: string, version?: string);

      addHeaderEntry(key: string, value: string): void;
      addFileEntry(name: string, type: string, fileData: Uint8Array): void;
      compile(headerFiles: { name: string; type: string; data: Blob; }[], bodyFiles: { name: string; type: string; data: Blob; }[]): Promise<Uint8Array>;
    }
    export interface EPKFile {
      type: string;
      name: string;
      data: Blob;
    }
    class EPKDecompiler {

      static epkOldHeader: string;
      static epkNewHeader: string;
      static epkFooter: string;

      data: Uint8Array;
      header: Uint8Array;
      footer: Uint8Array;
      body: util.Uint8Reader;
      textDecoder: TextDecoder;
      textEncoder: TextEncoder;
      version: string;
      fileName: string;
      comment: string;
      numFiles: number;
      compressionType: string;
      contentBody: util.Uint8Reader;
      filesRead: number;
      files: EPKFile[];

      constructor(data: Uint8Array);

      decompile(): Promise<EPKFile[] | null>;
      readFiles(): void;
      readFile(): EPKFile | number | null;
    }
  }
  namespace util {
    class Uint8Writer {
      textEncoder: TextEncoder;
      buffer: Uint8Array;

      constructor();

      addData(data: Uint8Array): void;
      writeByte(value: number): void;
      writeByteString(value: string): void;
      writeShortString(value: string): void;
      writeIntString(value: string): void;
      writeShort(num: number): void;
      writeInt(num: number): void;
      writeLong(num: number): void;
    }
    class Uint8Reader {
      buffer: Uint8Array;
      offset: number;

      constructor(buffer: Uint8Array);

      read(): number;
      readByte(): number;
      advance(num: number): void;
      readShort(): number;
      readInt(): number;
      readString(): string;
      readShortString(): string;
    }
    /**
     * Provides methods to interact with the PaperMC API.
     */
    class PaperMCAPI {
      mainURL: string;
      utils: WebUtils;

      /**
       * @param {string} [mainURL="https://api.papermc.io/v2/"] - Base URL for the API.
       */
      constructor(mainURL?: string);

      /**
       * Retrieves a list of all projects.
       * @returns {Promise<Object|null>} List of projects or null on error.
       */
      getProjects(): Promise<Object | null>;

      /**
       * Retrieves details of a specific project.
       * @param {string} project - The project name.
       * @returns {Promise<Object|null>} Project details or null on error.
       */
      getProject(project: string): Promise<Object | null>;

      /**
       * Retrieves details of a specific project version.
       * @param {string} project - The project name.
       * @param {string} version - The version identifier.
       * @returns {Promise<Object|null>} Version details or null on error.
       */
      getProjectByVersion(project: string, version: string): Promise<Object | null>;

      /**
       * Retrieves all builds for a specific project version.
       * @param {string} project - The project name.
       * @param {string} version - The version identifier.
       * @returns {Promise<Object|null>} Builds data or null on error.
       */
      getProjectBuilds(project: string, version: string): Promise<Object | null>;

      /**
       * Retrieves details of a specific build for a project version.
       * @param {string} project - The project name.
       * @param {string} version - The version identifier.
       * @param {number} build - The build number.
       * @returns {Promise<Object|null>} Build details or null on error.
       */
      getProjectByBuild(project: string, version: string, build: number): Promise<Object | null>;

      /**
       * Downloads a specific build for a project version.
       * @param {string} project - The project name.
       * @param {string} version - The version identifier.
       * @param {number} build - The build number.
       * @returns {Promise<Uint8Array|null>} Binary data or null on error.
       */
      getDownloadProject(project: string, version: string, build: number): Promise<Uint8Array | null>;

      /**
       * Retrieves the latest version of a project.
       * @param {string} project - The project name.
       * @returns {Promise<string|null>} Latest version or null on error.
       */
      getProjectLatestVersion(project: string): Promise<string | null>;

      /**
       * Retrieves the latest build for a specific project version.
       * @param {string} project - The project name.
       * @param {string} version - The version identifier.
       * @returns {Promise<number|null>} Latest build number or null on error.
       */
      getProjectLatestBuild(project: string, version: string): Promise<number | null>;

      /**
       * Retrieves the latest version and build of a project.
       * @param {string} project - The project name.
       * @returns {Promise<{version: string, build: number}|null>} Latest version and build or null on error.
       */
      getProjectLatest(project: string): Promise<{ version: string, build: number } | null>;

      /**
       * Downloads the latest build of a project.
       * @param {string} project - The project name.
       * @returns {Promise<Uint8Array|null>} Binary data or null on error.
       */
      getProjectDownloadLatest(project: string): Promise<Uint8Array | null>;
    }
    /**
     * Utility class for web requests.
     */
    class WebUtils {
      /**
       * Fetches and parses JSON data from a URL.
       * @param {string} url - The URL to fetch data from.
       * @returns {Promise<Object|null>} Parsed JSON data or null on error.
       */
      fetchJSON(url: string): Promise<Object | null>;

      /**
       * Fetches raw binary data from a URL as a Uint8Array.
       * @param {string} url - The URL to fetch data from.
       * @returns {Promise<Uint8Array|null>} Binary data as Uint8Array or null on error.
       */
      fetchBytes(url: string): Promise<Uint8Array | null>;
    }
    /**
     * Manages the dynamic loading and removal of web resources such as scripts and stylesheets.
     */
    class WebResourceManager {
      /**
       * Loads a JavaScript script from a URL and executes it.
       * @param {string} url - The URL of the script to load.
       * @param {string} type - The type of the script to load.
       * @param {number} timeout - Time in milliseconds to wait before timing out the load.
       * @returns {Promise<void>} - Resolves when the script is loaded and executed.
       */
      loadScript(url: string, type?: string, timeout?: number): Promise<void>;

      /**
       * Loads a CSS stylesheet from a URL.
       * @param {string} url - The URL of the CSS file.
       * @param {number} timeout - Time in milliseconds to wait before timing out the load.
       * @returns {Promise<void>} - Resolves when the CSS is loaded.
       */
      loadCSS(url: string, timeout?: number): Promise<void>;

      /**
       * Removes a dynamically loaded CSS stylesheet.
       * @param {string} url - The URL of the CSS file to remove.
       * @returns {void}
       */
      removeCSS(url: string): void;

      /**
       * Check if the script is already loaded.
       * @param {string} url - The URL of the script.
       * @returns {boolean} - Returns true if the script is already loaded.
       */
      isScriptLoaded(url: string): boolean;

      /**
       * Check if the CSS is already loaded.
       * @param {string} url - The URL of the CSS file.
       * @returns {boolean} - Returns true if the CSS is already loaded.
       */
      isCSSLoaded(url: string): boolean;
    }
    const crc32: (data: Uint8Array) => number;
  }
  namespace gui {
    class GuiColor {
      private red: number;
      private green: number;
      private blue: number;
      private alpha: number;

      constructor(color?: number);

      public setColor(color: number): void;

      public static from(
        red: number,
        green: number,
        blue: number,
        alpha?: number
      ): GuiColor;

      public applyDropShadow(): void;

      public getColorValue(): number;

      public getRed(): number;
      public getGreen(): number;
      public getBlue(): number;
      public getAlpha(): number;

      public setRed(value: number): void;
      public setGreen(value: number): void;
      public setBlue(value: number): void;
      public setAlpha(value: number): void;
    }
    enum GuiScreenType {
      Chat = "net.minecraft.client.gui.GuiChat",
      CommandBlock = "GuiCommandBlock",
      Controls = "net.minecraft.client.gui.GuiControls",
      CreateFlatWorld = "net.minecraft.client.gui.GuiCreateFlatWorld",
      CreateWorld = "net.minecraft.client.gui.GuiCreateWorld",
      CustomizeSkin = "net.minecraft.client.gui.GuiCustomizeSkin",
      CustomizeWorldScreen = "net.minecraft.client.gui.GuiCustomizeWorldScreen",
      Disconnected = "net.minecraft.client.gui.GuiDisconnected",
      DownloadTerrain = "net.minecraft.client.gui.GuiDownloadTerrain",
      ErrorScreen = "net.minecraft.client.gui.GuiErrorScreen",
      FlatPresets = "net.minecraft.client.gui.GuiFlatPresets",
      GameOver = "net.minecraft.client.gui.GuiGameOver",
      IngameMenu = "net.minecraft.client.gui.GuiIngameMenu",
      Language = "net.minecraft.client.gui.GuiLanguage",
      MainMenu = "net.minecraft.client.gui.GuiMainMenu",
      MemoryErrorScreen = "net.minecraft.client.gui.GuiMemoryErrorScreen",
      Multiplayer = "net.minecraft.client.gui.GuiMultiplayer",
      Options = "net.minecraft.client.gui.GuiOptions",
      RenameWorld = "net.minecraft.client.gui.GuiRenameWorld",
      AddServer = "net.minecraft.client.gui.GuiScreenAddServer",
      Book = "net.minecraft.client.gui.GuiScreenBook",
      CustomizePresets = "net.minecraft.client.gui.GuiScreenCustomizePresets",
      OptionsSounds = "net.minecraft.client.gui.GuiScreenOptionsSounds",
      ResourcePacks = "net.minecraft.client.gui.GuiScreenResourcePacks",
      ServerList = "net.minecraft.client.gui.GuiScreenServerList",
      Working = "net.minecraft.client.gui.GuiScreenWorking",
      SelectWorld = "net.minecraft.client.gui.GuiSelectWorld",
      VideoSettings = "net.minecraft.client.gui.GuiVideoSettings",
      WinGame = "net.minecraft.client.gui.GuiWinGame",
      YesNo = "net.minecraft.client.gui.GuiYesNo",
      ChatOptions = "net.minecraft.client.gui.ScreenChatOptions",
      Achievements = "net.minecraft.client.gui.GuiAchievements",
      Stats = "net.minecraft.client.gui.GuiStats",
      Container = "net.minecraft.client.gui.GuiContainer",
      EditSign = "net.minecraft.client.gui.GuiEditSign",
      Connecting = "net.minecraft.client.gui.GuiConnecting",
      EnterBootMenu = "net.minecraft.client.gui.GuiScreenEnterBootMenu",
      InspectSessionToken = "net.minecraft.client.gui.GuiScreenInspectSessionToken",
      RevokeSessionToken = "net.minecraft.client.gui.GuiScreenRevokeSessionToken",
      SendRevokeRequest = "net.minecraft.client.gui.GuiScreenSendRevokeRequest",
      GenericErrorMessage = "net.minecraft.client.gui.GuiScreenGenericErrorMessage",
      VideosettingsWarning = "net.minecraft.client.gui.GuiScreenVideosettingsWarning",
      VisualViewport = "net.minecraft.client.gui.GuiScreenVisualViewport",
      VSyncReEnabled = "net.minecraft.client.gui.GuiScreenVSyncReEnabled",
      Notifications = "net.minecraft.client.gui.GuiScreenNotifications",
      ShaderConfig = "net.minecraft.client.gui.GuiShaderConfig",
      ShadersNotSupported = "net.minecraft.client.gui.GuiShadersNotSupported",
      ContentWarning = "net.minecraft.client.gui.GuiScreenContentWarning",
      Authentication = "net.minecraft.client.gui.GuiAuthenticationScreen",
      DefaultUsernameNote = "net.minecraft.client.gui.GuiScreenDefaultUsernameNote",
      EditCape = "net.minecraft.client.gui.GuiScreenEditCape",
      EditProfile = "net.minecraft.client.gui.GuiScreenEditProfile",
      ExportProfile = "net.minecraft.client.gui.GuiScreenExportProfile",
      ImportExportProfile = "net.minecraft.client.gui.GuiScreenImportExportProfile",
      ImportProfile = "net.minecraft.client.gui.GuiScreenImportProfile",
      RecordingNote = "net.minecraft.client.gui.GuiScreenRecordingNote",
      RecordingSettings = "net.minecraft.client.gui.GuiScreenRecordingSettings",
      SelectCodec = "net.minecraft.client.gui.GuiScreenSelectCodec",
      HandshakeApprove = "net.minecraft.client.gui.GuiHandshakeApprove",
      AddRelay = "net.minecraft.client.gui.GuiScreenAddRelay",
      BackupWorldSelection = "net.minecraft.client.gui.GuiScreenBackupWorldSelection",
      ChangeRelayTimeout = "net.minecraft.client.gui.GuiScreenChangeRelayTimeout",
      Connection = "net.minecraft.client.gui.GuiScreenConnection",
      CreateWorldSelection = "net.minecraft.client.gui.GuiScreenCreateWorldSelection",
      DemoIntegratedServerFailed = "net.minecraft.client.gui.GuiScreenDemoIntegratedServerFailed",
      DemoIntegratedServerStart = "net.minecraft.client.gui.GuiScreenDemoIntegratedServerStart",
      DemoPlayWorldSelection = "net.minecraft.client.gui.GuiScreenDemoPlayWorldSelection",
      IntegratedServerBusy = "net.minecraft.client.gui.GuiScreenIntegratedServerBusy",
      IntegratedServerCrashed = "net.minecraft.client.gui.GuiScreenIntegratedServerCrashed",
      IntegratedServerFailed = "net.minecraft.client.gui.GuiScreenIntegratedServerFailed",
      IntegratedServerStartup = "net.minecraft.client.gui.GuiScreenIntegratedServerStartup",
      LANConnect = "net.minecraft.client.gui.GuiScreenLANConnect",
      LANConnecting = "net.minecraft.client.gui.GuiScreenLANConnecting",
      LANInfo = "net.minecraft.client.gui.GuiScreenLANInfo",
      LANNotSupported = "net.minecraft.client.gui.GuiScreenLANNotSupported",
      NameWorldImport = "net.minecraft.client.gui.GuiScreenNameWorldImport",
      NoRelays = "net.minecraft.client.gui.GuiScreenNoRelays",
      OldSeedWarning = "net.minecraft.client.gui.GuiScreenOldSeedWarning",
      RAMDiskModeDetected = "net.minecraft.client.gui.GuiScreenRAMDiskModeDetected",
      Relay = "net.minecraft.client.gui.GuiScreenRelay",
      SingleplayerConnecting = "net.minecraft.client.gui.GuiScreenSingleplayerConnecting",
      ShareToLAN = "net.minecraft.client.gui.GuiShareToLAN",
      UpdateDownloadSuccess = "net.minecraft.client.gui.GuiUpdateDownloadSuccess",
      UpdateInstallOptions = "net.minecraft.client.gui.GuiUpdateInstallOptions",
      UpdateVersionList = "net.minecraft.client.gui.GuiUpdateVersionList",
      PhishingWarning = "net.minecraft.client.gui.GuiScreenPhishingWarning",
      ReceiveServerInfo = "net.minecraft.client.gui.GuiScreenReceiveServerInfo",
      ServerInfo = "net.minecraft.client.gui.GuiScreenServerInfo",
      ServerInfoDesktop = "net.minecraft.client.gui.GuiScreenServerInfoDesktop"
    }
  }
}