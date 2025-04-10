import { WebUtils } from "./WebUtils";
/**
* Provides methods to interact with the PaperMC API.
*/
export class PaperMCAPI {
    mainURL: string;
    utils: WebUtils;
    /**
     * @param {string} [mainURL="https://api.papermc.io/v2/"] - Base URL for the API.
     */
    constructor(mainURL:string = "https://api.papermc.io/v2/") {
        this.mainURL = mainURL;
        this.utils = new WebUtils();
    }

    /**
     * Retrieves a list of all projects.
     * @returns {Promise<Object|null>} List of projects or null on error.
     */
    async getProjects() {
        return await this.utils.fetchJSON(`${this.mainURL}projects`);
    }

    /**
     * Retrieves details of a specific project.
     * @param {string} project - The project name.
     * @returns {Promise<Object|null>} Project details or null on error.
     */
    async getProject(project:string) {
        if (!project) throw new Error("Project name is required.");
        return await this.utils.fetchJSON(`${this.mainURL}projects/${project}`);
    }

    /**
     * Retrieves details of a specific project version.
     * @param {string} project - The project name.
     * @param {string} version - The version identifier.
     * @returns {Promise<Object|null>} Version details or null on error.
     */
    async getProjectByVersion(project:string, version:string) {
        if (!project || !version) throw new Error("Project and version are required.");
        return await this.utils.fetchJSON(`${this.mainURL}projects/${project}/versions/${version}`);
    }

    /**
     * Retrieves all builds for a specific project version.
     * @param {string} project - The project name.
     * @param {string} version - The version identifier.
     * @returns {Promise<Object|null>} Builds data or null on error.
     */
    async getProjectBuilds(project:string, version:string) {
        if (!project || !version) throw new Error("Project and version are required.");
        return await this.utils.fetchJSON(`${this.mainURL}projects/${project}/versions/${version}/builds`);
    }

    /**
     * Retrieves details of a specific build for a project version.
     * @param {string} project - The project name.
     * @param {string} version - The version identifier.
     * @param {number} build - The build number.
     * @returns {Promise<Object|null>} Build details or null on error.
     */
    async getProjectByBuild(project:string, version:string, build:number) {
        if (!project || !version || build == null) throw new Error("Project, version, and build are required.");
        return await this.utils.fetchJSON(`${this.mainURL}projects/${project}/versions/${version}/builds/${build}`);
    }

    /**
     * Downloads a specific build for a project version.
     * @param {string} project - The project name.
     * @param {string} version - The version identifier.
     * @param {number} build - The build number.
     * @returns {Promise<Uint8Array|null>} Binary data or null on error.
     */
    async getDownloadProject(project:string, version:string, build:number) {
        if (!project || !version || build == null) throw new Error("Project, version, and build are required.");
        const jarName = `${project}-${version}-${build}.jar`;
        return await this.utils.fetchBytes(`${this.mainURL}projects/${project}/versions/${version}/builds/${build}/downloads/${jarName}`);
    }

    /**
     * Retrieves the latest version of a project.
     * @param {string} project - The project name.
     * @returns {Promise<string|null>} Latest version or null on error.
     */
    async getProjectLatestVersion(project:string) {
        const data = await this.getProject(project);
        return data?.versions?.at(-1) || null;
    }

    /**
     * Retrieves the latest build for a specific project version.
     * @param {string} project - The project name.
     * @param {string} version - The version identifier.
     * @returns {Promise<number|null>} Latest build number or null on error.
     */
    async getProjectLatestBuild(project:string, version:string) {
        const data = await this.getProjectByVersion(project, version);
        return data?.builds?.at(-1) || null;
    }

    /**
     * Retrieves the latest version and build of a project.
     * @param {string} project - The project name.
     * @returns {Promise<{version: string, build: number}|null>} Latest version and build or null on error.
     */
    async getProjectLatest(project:string) {
        const latestVersion = await this.getProjectLatestVersion(project);
        if (!latestVersion) return null;
        const latestBuild = await this.getProjectLatestBuild(project, latestVersion);
        if (latestBuild == null) return null;
        return { version: latestVersion, build: latestBuild };
    }

    /**
     * Downloads the latest build of a project.
     * @param {string} project - The project name.
     * @returns {Promise<Uint8Array|null>} Binary data or null on error.
     */
    async getProjectDownloadLatest(project:string) {
        const latestData = await this.getProjectLatest(project);
        if (!latestData) return null;
        return await this.getDownloadProject(project, latestData.version, latestData.build);
    }
}