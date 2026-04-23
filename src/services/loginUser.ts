import { User } from "@/types/user";
import prisma from "@/lib/db";
import { compareHashed, hashPassword } from "@/lib/hash";
import { createAuthTokens } from "@/lib/auth";
import { validateLoginInput } from "@/lib/validation";

export async function LoginUser(user: User) {
    const validatedUser = validateLoginInput({
        email: user.email,
        password: user.password,
    });

    const validateUser = await prisma.user.findUnique({
        where: { email: validatedUser.email }
    });

    if (!validateUser) {
        throw new Error("Usuario no encontrado");
    }

    const validateHash = await compareHashed(validatedUser.password, validateUser.password);
    if (!validateHash) {
        throw new Error("Contraseña incorrecta");

    }

    const payload = {
        userId: validateUser.id,
        email: validateUser.email
    };

    const { accessToken, refreshToken } = createAuthTokens(payload);
    const refreshTokenHash = await hashPassword(refreshToken);

    await prisma.user.update({
        where: { id: validateUser.id },
        data: { refreshTokenHash }
    });

    return {
        user: {
            id: validateUser.id,
            email: validateUser.email,
            nombre: validateUser.nombre,
            apellido: validateUser.apellido,
        },
        accessToken,
        refreshToken
    }
}
