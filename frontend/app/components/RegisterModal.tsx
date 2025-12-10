// app/components/RegisterModal.tsx
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

const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onClose,
  onRegister,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && nameRef.current) {
      nameRef.current.focus();
    }
  }, [open]);

  const submit = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Call parent with full UserData (id included)
      onRegister({
        id: data.user?.id || Date.now().toString(), // fallback if backend doesn't return id
        name,
        email,
        isAdmin: data.user?.isAdmin || false,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">Join K-Shop today</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-500">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <input
                ref={nameRef}
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full outline-none"
                disabled={isLoading}
              />
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-500">
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full outline-none"
                disabled={isLoading}
              />
            </label>
          </div>

          <div>
            <label className="flex items-center gap-3 rounded-lg border border-gray-300 px-4 py-3 focus-within:border-blue-500">
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none"
                disabled={isLoading}
              />
            </label>
          </div>
        </div>

        {error && <div className="mt-4 text-sm text-red-600 text-center">{error}</div>}

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="flex-1">
            Cancel
          </Button>
          <Button onClick={submit} isLoading={isLoading} className="flex-1">
            Create account
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button className="font-medium text-blue-600 hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;