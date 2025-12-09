// app/components/ClientShell.tsx
"use client";

import React, { useState } from 'react';
import FloatingCart from './FloatingCart';
import MiniCart from './MiniCart';

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const [miniOpen, setMiniOpen] = useState(false);

  return (
    <>
      {children}
      <FloatingCart onOpen={() => setMiniOpen(true)} />
      <MiniCart open={miniOpen} onClose={() => setMiniOpen(false)} />
    </>
  );
}
