import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export interface AuthTokenPayload {
    userId: number;
    email: string;
}

export function generateAccessToken(payload: AuthTokenPayload) {
    return jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m"
    });
}

export function generateRefreshToken(payload: AuthTokenPayload) {
    return jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d"
    });
}

export function validateAccesToken(token: string) {
    return jwt.verify(token, ACCESS_SECRET) as AuthTokenPayload;
}

export function validateRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET) as AuthTokenPayload;
}
