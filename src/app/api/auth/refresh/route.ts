import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import prisma from "@/lib/db";
import { createAuthTokens, setAuthCookies } from "@/lib/auth";
import { REFRESH_COOKIE_NAME } from "@/lib/auth-cookies";
import { compareHashed, hashPassword } from "@/lib/hash";
import { validateRefreshToken } from "@/lib/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: "No hay sesion activa" }, { status: 401 });
    }

    const payload = validateRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user?.refreshTokenHash) {
      return NextResponse.json({ message: "Sesion invalida" }, { status: 401 });
    }

    const tokenMatches = await compareHashed(refreshToken, user.refreshTokenHash);

    if (!tokenMatches) {
      return NextResponse.json({ message: "Sesion invalida" }, { status: 401 });
    }

    const tokens = createAuthTokens({
      userId: user.id,
      email: user.email,
    });

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshTokenHash: await hashPassword(tokens.refreshToken),
      },
    });

    await setAuthCookies(tokens);

    return NextResponse.json({
      message: "Sesion renovada",
      accessToken: tokens.accessToken,
    });
  } catch {
    return NextResponse.json({ message: "No se pudo renovar la sesion" }, { status: 401 });
  }
}
