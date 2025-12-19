// src/lib/jwt.ts
import { SignJWT, jwtVerify } from "jose";
import User from "@/src/models/User";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);



export interface JWTPayload extends Record<string, unknown> {
  id: string;
}

export interface AuthUser {
  id: string;
  level: number;
  isActivated: boolean;
}



export async function signToken(
  payload: JWTPayload
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}



export async function verifyJWT(token?: string) {
  if (!token) return null;

  try {
    return await jwtVerify(token, secret);
  } catch {
    return null;
  }
}


export async function verifyToken(
  token?: string
): Promise<AuthUser | null> {
  if (!token) return null;

  try {
    // 🔐 Step 1: cryptographic verification
    const { payload } = await jwtVerify(token, secret);

    if (!payload?.id || typeof payload.id !== "string") {
      console.warn("⚠️ Invalid JWT payload:", payload);
      return null;
    }

    // 🗄 Step 2: authoritative DB lookup
    const user = await User.findById(payload.id).select(
      "_id level isActivated role"
    );

    if (!user) return null;

    return {
      id: user._id.toString(),
      level: user.level,
      isActivated: user.isActivated,
    };
  } catch (err) {
    console.error("❌ verifyAuthUser failed:", err);
    return null;
  }
}
