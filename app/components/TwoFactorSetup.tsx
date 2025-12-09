// app/components/TwoFactorSetup.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "./ui/Button";
import { toast } from "sonner";

const TwoFactorSetup = () => {
  const { data: session } = useSession();
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Fetch 2FA status
    const checkTwoFactorStatus = async () => {
      const response = await fetch("/api/2fa/status");
      const data = await response.json();
      if (response.ok) setIsEnabled(data.enabled);
    };
    if (session) checkTwoFactorStatus();
  }, [session]);

  const initiateTwoFactorSetup = async () => {
    setLoading(true);
    const response = await fetch("/api/2fa/setup", { method: "POST" });
    const data = await response.json();
    if (response.ok) {
      setQrCode(data.qrCodeDataUrl);
      setSetupMode(true);
    } else {
      toast.error(data.error);
    }
    setLoading(false);
  };

  const verifyAndEnable = async () => {
    setLoading(true);
    const response = await fetch("/api/2fa/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await response.json();
    if (response.ok) {
      toast.success(data.message);
      setIsEnabled(true);
      setSetupMode(false);
    } else {
      toast.error(data.error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h3>Two-Factor Authentication</h3>
      {isEnabled ? (
        <p>2FA is enabled.</p>
      ) : !setupMode ? (
        <Button onClick={initiateTwoFactorSetup} disabled={loading}>
          {loading ? "Loading..." : "Enable 2FA"}
        </Button>
      ) : (
        <div>
          <img src={qrCode} alt="QR Code" />
          <input placeholder="Enter 6-digit code" value={token} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)} />
          <Button onClick={verifyAndEnable} disabled={loading}>Verify</Button>
        </div>
      )}
    </div>
  );
};

export default TwoFactorSetup;