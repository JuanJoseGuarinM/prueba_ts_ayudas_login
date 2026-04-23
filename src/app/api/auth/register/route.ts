import { registerUser } from "@/services/registerUser";
import { NextResponse } from "next/server";
import { validateRegisterInput } from "@/lib/validation";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedBody = validateRegisterInput(body);

        await registerUser(validatedBody);
        return NextResponse.json(
            { message: "Registrado correctamente" },
            { status: 201 }
        );

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Error inesperado";

        const statusCode = message.includes("registrado") ? 409 : 400;

        return NextResponse.json(
            { message },
            { status: statusCode }
        );
    }
}
