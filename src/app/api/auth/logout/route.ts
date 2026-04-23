import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import prisma from "@/lib/db";
import { clearAuthCookies } from "@/lib/auth";
import { REFRESH_COOKIE_NAME } from "@/lib/auth-cookies";
import { validateRefreshToken } from "@/lib/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

    if (refreshToken) {
      try {
        const payload = validateRefreshToken(refreshToken);
        await prisma.user.update({
          where: { id: payload.userId },
          data: { refreshTokenHash: null },
        });
      } catch {
        // Ignore invalid cookies and continue with cleanup.
      }
    }

    await clearAuthCookies();

    return NextResponse.json({ message: "Sesion cerrada" });
  } catch {
    return NextResponse.json({ message: "No se pudo cerrar la sesion" }, { status: 500 });
  }
}
