/**
* Manages the dynamic loading and removal of web resources such as scripts and stylesheets.
*/
export class WebResourceManager {
    /**
     * Loads a JavaScript script from a URL and executes it.
     * @param {string} url - The URL of the script to load.
     * @param {string} type - The type of the script to load.
     * @param {number} timeout - Time in milliseconds to wait before timing out the load.
     * @returns {Promise<void>} - Resolves when the script is loaded and executed.
     */
    async loadScript(url: string, type: string = "", timeout: number = 10000) {
        if (this.isScriptLoaded(url)) {
            //console.log(`Script already loaded: ${url}`);
            return Promise.resolve();
        }

        return new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.type = 'text/javascript';
            script.async = true;
            script.type = type;

            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${url}`));

            document.head.appendChild(script);

            // Set a timeout to reject if loading takes too long
            const timeoutId = setTimeout(() => reject(new Error(`Script loading timeout: ${url}`)), timeout);

            script.onload = () => {
                clearTimeout(timeoutId);
                console.log(`Script loaded: ${url}`);
                resolve();
            };
        });
    }

    /**
     * Loads a CSS stylesheet from a URL.
     * @param {string} url - The URL of the CSS file.
     * @param {number} timeout - Time in milliseconds to wait before timing out the load.
     * @returns {Promise<void>} - Resolves when the CSS is loaded.
     */
    async loadCSS(url: string, timeout: number = 10000) {
        if (this.isCSSLoaded(url)) {
            console.log(`CSS already loaded: ${url}`);
            return Promise.resolve();  // If CSS is already loaded, return a resolved promise
        }

        return new Promise<void>((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            document.head.appendChild(link);

            // Set a timeout to reject if loading takes too long
            const timeoutId = setTimeout(() => {
                reject(new Error(`CSS loading timeout: ${url}`));
            }, timeout);

            link.onload = () => {
                clearTimeout(timeoutId);
                console.log(`CSS loaded: ${url}`);
                resolve();  // Resolve the promise when the CSS is loaded
            };

            link.onerror = () => {
                clearTimeout(timeoutId);
                console.error(`Failed to load CSS: ${url}`);
                reject(new Error(`Failed to load CSS: ${url}`));  // Reject the promise if the CSS fails to load
            };
        });
    }

    /**
     * Removes a dynamically loaded CSS stylesheet.
     * @param {string} url - The URL of the CSS file to remove.
     * @returns {void}
     */
    removeCSS(url: string) {
        const links = document.querySelectorAll(`link[rel="stylesheet"][href="${url}"]`);
        links.forEach(link => {
            if (link.parentNode) {
                link.parentNode.removeChild(link);
            }
        });
        console.log(`CSS removed: ${url}`);
    }

    /**
     * Check if the script is already loaded.
     * @param {string} url - The URL of the script.
     * @returns {boolean} - Returns true if the script is already loaded.
     */
    isScriptLoaded(url: string) {
        const scripts = document.querySelectorAll(`script[src="${url}"]`);
        return scripts.length > 0;
    }

    /**
     * Check if the CSS is already loaded.
     * @param {string} url - The URL of the CSS file.
     * @returns {boolean} - Returns true if the CSS is already loaded.
     */
    isCSSLoaded(url: string) {
        const links = document.querySelectorAll(`link[rel="stylesheet"][href="${url}"]`);
        return links.length > 0;
    }
}