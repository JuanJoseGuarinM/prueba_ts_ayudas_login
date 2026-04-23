import { LoginUser } from "@/services/loginUser";
import { setAuthCookies } from "@/lib/auth";
import { validateLoginInput } from "@/lib/validation";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validatedBody = validateLoginInput(body);
        const token = await LoginUser(validatedBody);
        await setAuthCookies(token);

        return NextResponse.json(
            {
                message: "Inicio de sesion exitoso",
                user: token.user,
                accessToken: token.accessToken,
            },
            { status: 200 }
        );

    } catch (error: unknown) {

        const message = error instanceof Error ? error.message : "Error inesperado";

        return NextResponse.json(
            { message },
            { status: 401 }
        );
    }
}
