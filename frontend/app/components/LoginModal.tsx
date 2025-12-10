// app/components/LoginModal.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mail, Lock, Check, X } from "lucide-react";
import { Button } from "./ui/Button";
import { useSession, signIn } from "next-auth/react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin: (user: { id: string; name: string; email: string; isAdmin?: boolean }, remember?: boolean) => void;
};

const LoginModal: React.FC<Props> = ({ open, onClose, onLogin }) => {
  const { data: session, update } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => emailRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  // Inside LoginModal.tsx — replace the submit function
const submit = async () => {
  setIsLoading(true);
  setError('');

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.token);
    onLogin(data.user || { name: email.split('@')[0], email, isAdmin: data.user?.isAdmin });
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  const verifyMFA = async () => {
    setIsLoading(true);
    setError(null);

    const res = await fetch("/api/auth/verify-2fa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: otp }),
    });

    const data = await res.json();

    setIsLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    await update({ twoFactorVerified: true });
    toast.success(`Welcome ${session?.user?.name ?? ''}!`);
    if (session) onLogin(session.user as any, remember);
    onClose();
  };

  const handleGoogleLogin = () => {
    signIn("google");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <button onClick={onClose} className="absolute top-2 right-2"><X /></button>
        <h2>Login</h2>
        {requiresMFA ? (
          <div>
            <input type="text" value={otp} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value)} placeholder="Enter OTP" />
            <Button onClick={verifyMFA} isLoading={isLoading}>Verify</Button>
          </div>
        ) : (
          <div>
            <input ref={emailRef} type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} placeholder="Email" />
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} placeholder="Password" />
            <label>
              <input type="checkbox" checked={remember} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)} />
              Remember me
            </label>
            {error && <div className="text-red-600">{error}</div>}
            <Button onClick={submit} isLoading={isLoading}>Sign in</Button>
            <Button variant="secondary" onClick={handleGoogleLogin} disabled={isLoading}>Google</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;