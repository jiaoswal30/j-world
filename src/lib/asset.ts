/** Resolve a /public path against the deploy base, so the site works at a domain root or a sub-path. */
export const asset = (path: string) => (/^(https?:|data:|blob:)/.test(path) ? path : import.meta.env.BASE_URL + path.replace(/^\//, ''));
