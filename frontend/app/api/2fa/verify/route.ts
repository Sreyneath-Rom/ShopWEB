// app/api/2fa/verify/route.ts  ← កែដូចគ្នា
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth"; // ← ប្តូរ
import { verifyToken } from "@/app/utils/2fa";
import { readUsers, writeUsers } from "@/app/lib/users";

export async function POST(req: Request) {
  const session = await auth(); // ← ប្រើ auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token } = await req.json();
  // ... rest same
}