// app/components/registerModel
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Mail, User as UserIcon, Lock, X } from "lucide-react";
import { Button } from "./ui/Button";

interface UserData {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  onRegister: (user: UserData, remember?: boolean) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ open, onClose, onRegister }) => {
  const nameRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Autofocus the name input when modal opens
  useEffect(() => {
    if (open) setTimeout(() => nameRef.current?.focus(), 50);
  }, [open]);

  if (!open) return null;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirm("");
    setRemember(false);
    setError(null);
  };

  const submit = async () => {
    setError(null);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) return setError("Please enter your full name.");
    if (!trimmedEmail) return setError("Please enter your email.");
    if (!validateEmail(trimmedEmail)) return setError("Please enter a valid email address.");
    if (!password) return setError("Please enter a password.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords don't match.");

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail, password, remember }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setIsLoading(false);
        return;
      }

      onRegister(data.user, remember);
      resetForm();
      onClose();
    } catch (err: any) {
      setError(err.message || "Network error");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === "Enter") submit();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Register"
        className="relative w-full max-w-md transform rounded-xl bg-white p-6 shadow-xl transition-all duration-200"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create account</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded p-1 hover:bg-slate-100"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          {/* Name */}
          <div>
            <label className="text-sm text-slate-600">Full name</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <UserIcon className="w-4 h-4" />
              </span>
              <input
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 pl-10"
                placeholder="Your name"
                aria-label="Full name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-slate-600">Email</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 pl-10"
                placeholder="you@example.com"
                autoComplete="email"
                aria-label="Email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-slate-600">Password</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 pl-10"
                placeholder="Create a password"
                autoComplete="new-password"
                aria-label="Password"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm text-slate-600">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 rounded-lg border px-3 py-2"
              placeholder="Repeat password"
              aria-label="Confirm password"
            />
          </div>

          {/* Remember Me / Sign In */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <div className="text-sm text-slate-500">
              Already have an account?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => onClose()}
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={submit} isLoading={isLoading}>
              Create account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
