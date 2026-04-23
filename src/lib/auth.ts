import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  accessCookieOptions,
  refreshCookieOptions,
} from "@/lib/auth-cookies";
import {
  generateAccessToken,
  generateRefreshToken,
  validateAccesToken,
  validateRefreshToken,
  type AuthTokenPayload,
} from "@/lib/jwt";

export function createAuthTokens(payload: AuthTokenPayload) {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { accessToken, refreshToken };
}

export async function setAuthCookies(tokens: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookieStore = await cookies();

  cookieStore.set(ACCESS_COOKIE_NAME, tokens.accessToken, accessCookieOptions);
  cookieStore.set(REFRESH_COOKIE_NAME, tokens.refreshToken, refreshCookieOptions);
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(ACCESS_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}

export async function getAuthenticatedUserFromCookies(): Promise<AuthTokenPayload> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  if (accessToken) {
    try {
      return validateAccesToken(accessToken);
    } catch {
      // If the short-lived token expired, fallback to refresh validation.
    }
  }

  if (refreshToken) {
    try {
      return validateRefreshToken(refreshToken);
    } catch {
      // Ignore and redirect below.
    }
  }

  redirect("/login");
}
