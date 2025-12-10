// app/page.tsx
"use client";

import { useState } from "react";
import { BottomTabBar } from "./components/BottomTabBar";
import { AnimatePresence, motion } from "framer-motion";
import ScreenRouter from "./pages/ScreenRouter"; // ← default import, not named
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import { toast } from "sonner";
import { Screen } from "./types/types"; // ← make sure this exists

export default function HomePage() {
  // All required states
  const [view, setView] = useState<Screen>(Screen.LISTING);
  const [currentTab, setCurrentTab] = useState("home");
  const [product, setProduct] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Dummy handlers (replace with real ones)
  const handlers = {
    payment: {},
    success: {},
    failed: {},
    profile: { onBack: () => setView(Screen.LISTING) },
    admin: { onBack: () => setView(Screen.LISTING) },
  };

  return (
    <>
      <div className="min-h-screen pb-24 pt-safe">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <ScreenRouter
              view={view}
              product={product}
              orders={orders}
              user={user}
              handlers={handlers}
            />

            <LoginModal
              open={loginOpen}
              onClose={() => setLoginOpen(false)}
              onLogin={(u) => {
                setUser(u);
                setLoginOpen(false);
                toast.success(`Welcome back, ${u.name}!`);
              }}
            />

            <RegisterModal
              open={registerOpen}
              onClose={() => setRegisterOpen(false)}
              onRegister={(u) => {
                setUser(u);
                setRegisterOpen(false);
                toast.success("Account created!");
              }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomTabBar current={currentTab} onChange={setCurrentTab} />
    </>
  );
}