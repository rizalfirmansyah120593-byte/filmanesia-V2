/**
 * Uses the platform WHATWG fetch implementation instead of cross-fetch's
 * legacy node-fetch v2 fallback (which calls the deprecated url.parse API).
 */
const nativeFetch: typeof fetch = (...args) => globalThis.fetch(...args);

export default nativeFetch;
