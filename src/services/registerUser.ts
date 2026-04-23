import { User } from "@/types/user";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/hash";
import { normalizeEmail, validateRegisterInput } from "@/lib/validation";

export async function registerUser(user: User): Promise<void> {
    const validatedUser = validateRegisterInput({
        nombre: user.nombre ?? "",
        apellido: user.apellido ?? "",
        email: user.email,
        password: user.password,
        confirmPassword: user.confirmPassword,
    });

    const validateRegister = await prisma.user.findUnique({
        where: { email: normalizeEmail(validatedUser.email) }
    });

    if (validateRegister) {
        throw new Error("El correo ya esta registrado");
    }

    const hashed = await hashPassword(validatedUser.password);

    await prisma.user.create({
        data: {
            email: normalizeEmail(validatedUser.email),
            password: hashed,
            nombre: validatedUser.nombre,
            apellido: validatedUser.apellido
        }
    });
}
