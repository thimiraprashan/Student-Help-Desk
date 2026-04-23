const DEFAULT_BACKEND_URL = "http://127.0.0.1:5051";
const LEGACY_BACKEND_URLS = [
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "http://localhost:5001",
    "http://127.0.0.1:5001"
];

export const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/$/, "");
export const API_BASE_URL = `${BACKEND_URL}/api`;

export const withBackendUrl = (path = "") => {
    const normalizedPath = `${path ?? ""}`.replace(/^\/+/, "");
    return normalizedPath ? `${BACKEND_URL}/${normalizedPath}` : BACKEND_URL;
};

export const rewriteLegacyBackendUrl = (value) => {
    if (typeof value !== "string") {
        return value;
    }

    return LEGACY_BACKEND_URLS.reduce(
        (rewrittenValue, legacyUrl) => rewrittenValue.replace(legacyUrl, BACKEND_URL),
        value
    );
};

let fetchShimInstalled = false;

export const installLegacyBackendFetchShim = () => {
    if (fetchShimInstalled || typeof window === "undefined" || typeof window.fetch !== "function") {
        return;
    }

    const originalFetch = window.fetch.bind(window);

    window.fetch = (input, init) => {
        if (typeof input === "string") {
            return originalFetch(rewriteLegacyBackendUrl(input), init);
        }

        if (input instanceof URL) {
            return originalFetch(rewriteLegacyBackendUrl(input.toString()), init);
        }

        if (input instanceof Request) {
            const rewrittenUrl = rewriteLegacyBackendUrl(input.url);

            if (rewrittenUrl !== input.url) {
                return originalFetch(new Request(rewrittenUrl, input), init);
            }
        }

        return originalFetch(input, init);
    };

    fetchShimInstalled = true;
};
