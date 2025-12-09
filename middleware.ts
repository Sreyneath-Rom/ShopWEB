// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";
// import { authOptions } from "./app/lib/auth";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const protectedRoutes = ["/profile", "/admin", "/payment"];

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!token) return NextResponse.redirect(new URL("/login", req.url));
    if ((token as any).requiresTwoFactor) return NextResponse.redirect(new URL("/verify-2fa", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/admin", "/payment"],
};  