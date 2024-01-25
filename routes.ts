/**
 * An array of routes that are accessible to the public. These routes do not require authentication.
 * @type {string[]}
 */
export const publicRoutes: string[] = [
    "/",
    "/auth/new-verification",
    "/sklep",
    "/onas",
    "/konfigurator",
    "/blog",
    "/koszyk",
    "/api/shop/get"
]

/**
 * An array of routes that are used for authentication. These routes will redirect logged in users to the settings.
 * @type {string[]}
 */
export const authRoutes: string[] = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/forgot-password",
    "/auth/new-password",
    "/auth/two-factor"
]

/**
 * The prefix for the API auth routes.
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth"

/**
 * This is default login redirect.
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/konto"