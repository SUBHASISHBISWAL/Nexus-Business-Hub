export interface StoredUser {
  userId?: number | string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

export interface JwtPayload {
  exp?: number;
  nbf?: number;
  iat?: number;
  sub?: string;
  email?: string;
  role?: string;
  name?: string;
  [key: string]: any;
}

export type AuthState = "checking" | "authenticated" | "unauthenticated";

/**
 * Retrieves the stored auth token from localStorage.
 */
export function getStoredToken(): string | null {
  try {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    return token ? token.trim() : null;
  } catch {
    return null;
  }
}

/**
 * Decodes and parses a JWT payload. Returns null if invalid format.
 */
export function parseJwt(token: string): JwtPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.trim().split(".");
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const binaryStr = atob(padded);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const jsonStr = new TextDecoder().decode(bytes);
    return JSON.parse(jsonStr);
  } catch {
    return null;
  }
}

/**
 * Validates whether a token is a valid, unexpired JWT.
 */
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const trimmed = token.trim();
  if (!trimmed) return false;

  const payload = parseJwt(trimmed);
  if (!payload) {
    return false;
  }

  // Check expiration if present
  if (typeof payload.exp === "number") {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp <= nowInSeconds) {
      return false; // Expired
    }
  }

  return true;
}

/**
 * Clears all authentication-related keys from localStorage.
 */
export function clearAuthSession(): void {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("nexus_admin_pending_otp");
  } catch (err) {
    console.error("Error clearing auth session:", err);
  }

  window.dispatchEvent(new Event("userUpdated"));
}

/**
 * Validates the current session stored in localStorage.
 * If token is missing, invalid, or expired, cleans up stale storage
 * and returns unauthenticated state.
 */
export function validateCurrentSession(): {
  isAuthenticated: boolean;
  user: StoredUser | null;
} {
  try {
    const token = getStoredToken();

    if (!token || !isTokenValid(token)) {
      const hadStaleAuth =
        localStorage.getItem("isLoggedIn") === "true" ||
        localStorage.getItem("user") !== null ||
        localStorage.getItem("authToken") !== null ||
        localStorage.getItem("isAdmin") !== null;

      if (hadStaleAuth) {
        clearAuthSession();
      }
      return { isAuthenticated: false, user: null };
    }

    // Token is valid and unexpired
    const userRaw = localStorage.getItem("user");
    let user: StoredUser | null = null;
    if (userRaw) {
      try {
        user = JSON.parse(userRaw);
      } catch {
        user = null;
      }
    }

    // If user object was missing in localStorage, reconstruct from JWT payload
    if (!user) {
      const payload = parseJwt(token);
      if (payload) {
        user = {
          userId: payload.sub,
          email: payload.email,
          role:
            payload.role ||
            (payload.email === "admin@nexus.com" ? "Admin" : "Customer"),
          firstName: payload.name ? payload.name.split(" ")[0] : "",
          lastName: payload.name
            ? payload.name.split(" ").slice(1).join(" ")
            : "",
        };
        localStorage.setItem("user", JSON.stringify(user));
      }
    }

    if (localStorage.getItem("isLoggedIn") !== "true") {
      localStorage.setItem("isLoggedIn", "true");
    }

    return { isAuthenticated: true, user };
  } catch (err) {
    console.error("Error validating session:", err);
    clearAuthSession();
    return { isAuthenticated: false, user: null };
  }
}

/**
 * Helper to check if current user is authenticated.
 */
export function isAuthenticated(): boolean {
  return validateCurrentSession().isAuthenticated;
}

/**
 * Helper to get the current authenticated user.
 */
export function getCurrentUser(): StoredUser | null {
  return validateCurrentSession().user;
}

/**
 * Creates a valid JWT format for demo Admin OTP verification.
 * Contains standard claims (sub, email, role, exp) valid for 24 hours.
 */
export function createDemoAdminJwt(): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const payload = btoa(
    JSON.stringify({
      sub: "1",
      name: "Admin User",
      email: "admin@nexus.com",
      role: "Admin",
      iat: nowInSeconds,
      exp: nowInSeconds + 86400, // 24 hours
    })
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const signature = "demo_admin_signature";
  return `${header}.${payload}.${signature}`;
}
