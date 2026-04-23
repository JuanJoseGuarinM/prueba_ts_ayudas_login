import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

export const ACCESS_COOKIE_NAME = "accessToken";
export const REFRESH_COOKIE_NAME = "refreshToken";

const baseCookieOptions: Partial<ResponseCookie> = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export const accessCookieOptions: Partial<ResponseCookie> = {
  ...baseCookieOptions,
  maxAge: 60 * 15,
};

export const refreshCookieOptions: Partial<ResponseCookie> = {
  ...baseCookieOptions,
  maxAge: 60 * 60 * 24 * 7,
};
