// app/api/2fa/setup/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth"; // ← ប្តូរពី getServerSession
import { generateTwoFactorSecret, generateQRCode } from "@/app/utils/2fa";
import { readUsers, writeUsers } from "@/app/lib/users";

export async function POST() {
  const session = await auth(); // ← ប្រើ auth() វិញ!
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = readUsers();
  const user = users.find((u: any) => u.email === session.user.email);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { secret, otpAuthUrl } = generateTwoFactorSecret(user.email);
  const qrCodeDataUrl = await generateQRCode(otpAuthUrl);

  user.twoFactorSecret = secret;
  writeUsers(users);

  return NextResponse.json({ success: true, qrCodeDataUrl });
}