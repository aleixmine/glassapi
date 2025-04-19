/**
* Utility class for web requests.
*/
export class WebUtils {
    /**
     * Fetches and parses JSON data from a URL.
     * @param {string} url - The URL to fetch data from.
     * @returns {Promise<Object|null>} Parsed JSON data or null on error.
     */
    async fetchJSON(url:string) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching JSON data:", error);
            return null;
        }
    }

    /**
     * Fetches raw binary data from a URL as a Uint8Array.
     * @param {string} url - The URL to fetch data from.
     * @returns {Promise<Uint8Array|null>} Binary data as Uint8Array or null on error.
     */
    async fetchBytes(url:string) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();
            return new Uint8Array(arrayBuffer);
        } catch (error) {
            console.error("Error fetching bytes:", error);
            return null;
        }
    }
}