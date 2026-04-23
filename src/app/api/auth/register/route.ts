import { registerUser } from "@/services/registerUser";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const { nombre, apellido, email, password } = await req.json();
        if (!nombre || !apellido || !email || !password) {
            return NextResponse.json(
                { message: "Nombre, apellido, email y password requeridos" },
                { status: 400 }
            );
        }

        await registerUser({ nombre, apellido, email, password });
        return NextResponse.json(
            { message: "Registrado" },
            { status: 201 }
        );

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error inesperado";

        const statusCode = message.includes("existente") ? 409 : 500;

        return NextResponse.json(
            { message },
            { status: statusCode }
        );
    }
}