// app/verify-2fa/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/app/components/ui/Button";
import { toast } from "sonner";

export default function VerifyTwoFactor() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status, update } = useSession();

  useEffect(() => {
    if (status !== "loading" && session && !(session as any).requiresTwoFactor) {
      router.push("/");
    }
  }, [session, status, router]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || token.length !== 6) {
      toast.error("Enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/auth/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      await update({ twoFactorVerified: true });
      toast.success("Verified");
      router.push("/");
    } else {
      toast.error(data.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleVerification} className="space-y-4 w-80">
        <h1>Verify Identity</h1>
        <p>Enter the 6-digit code from your authenticator app</p>
        <input value={token} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)} maxLength={6} />
        <Button disabled={loading}>{loading ? "Verifying..." : "Verify"}</Button>
      </form>
    </div>
  );
}