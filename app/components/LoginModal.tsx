"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Mail, Lock, Check, X } from 'lucide-react';
import { Button } from './ui/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin: (user: { id: string; name: string; email: string; isAdmin?: boolean }, remember?: boolean) => void;
};

const LoginModal: React.FC<Props> = ({ open, onClose, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => emailRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const submit = async () => {
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return setError('Please enter your email.');
    if (!validateEmail(trimmed)) return setError('Please enter a valid email address.');
    if (!password) return setError('Please enter your password.');

    setIsLoading(true);
    // Simulate network delay for a better UX demo
    await new Promise((r) => setTimeout(r, 600));

    // Demo auth: password 'admin' grants admin rights
    const isAdmin = password === 'admin';
    const name = trimmed.split('@')[0] || trimmed;
    const user = { id: trimmed, name, email: trimmed, isAdmin };
    onLogin(user, remember);
    setIsLoading(false);
    onClose();
    setEmail('');
    setPassword('');
    setRemember(false);
  };

  const handleKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter') {
      submit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in"
        className="relative w-full max-w-md transform rounded-xl bg-white p-6 shadow-xl transition-all duration-200"
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Sign in</h3>
          <button aria-label="Close" onClick={onClose} className="rounded p-1 hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-slate-600">Email</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail className="w-4 h-4" /></span>
              <input
                ref={emailRef}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 pl-10"
                placeholder="you@example.com"
                autoComplete="email"
                aria-label="Email"
                aria-invalid={!!error}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-slate-600">Password</label>
            <div className="mt-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Lock className="w-4 h-4" /></span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-lg border px-3 py-2 pl-10 pr-10"
                placeholder="Your password"
                autoComplete="current-password"
                aria-label="Password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <button className="text-sm text-blue-600" onClick={() => alert('Password reset flow not implemented in demo')}>Forgot?</button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <span><X className="w-4 h-4" /></span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => { onClose(); setEmail(''); setPassword(''); setRemember(false); }} disabled={isLoading}>Cancel</Button>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={() => { /* demo social - no-op */ }} disabled={isLoading}>Google</Button>
              <Button onClick={submit} isLoading={isLoading}>Sign in</Button>
            </div>
          </div>

          <div className="mt-2 text-center text-sm text-slate-500">Or continue as a <button className="text-blue-600 underline" onClick={() => { onLogin({ id: 'guest', name: 'Guest', email: 'guest', isAdmin: false }, false); onClose(); }}>guest</button></div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
