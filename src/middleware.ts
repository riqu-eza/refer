import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

// export const runtime = "nodejs";   // ← REQUIRED FIX

export function middleware(req: NextRequest) {
  const token = req.cookies.get("session_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
