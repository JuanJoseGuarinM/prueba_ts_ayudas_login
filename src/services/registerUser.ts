import { User } from "@/types/user";
import prisma from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function registerUser(user: User): Promise<void> {

    const validateRegister = await prisma.user.findUnique({
        where: { email: user.email }
    });

    if (validateRegister) {
        throw new Error("Error registrando usuario existente");
    }

    const hashed = await hashPassword(user.password);

    await prisma.user.create({
        data: {
            email: user.email,
            password: hashed,
            nombre: user.nombre,
            apellido: user.apellido
        }
    });



}