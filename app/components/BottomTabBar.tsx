
// app/components/BottomTabBar.tsx
"use client";

import { motion } from "framer-motion";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/context/CartContext";

export function BottomTabBar({ current, onChange }: { current: string; onChange: (v: string) => void }) {
  const { count } = useCart();

  const haptic = () => "vibrate" in navigator && navigator.vibrate(30);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-t border-white/20 pb-safe">
      <div className="flex justify-around items-end h-20">
        {[
          { id: "home", icon: Home, label: "Home" },
          { id: "search", icon: Search, label: "Search" },
          { id: "cart", icon: ShoppingCart, label: "Cart" },
          { id: "profile", icon: User, label: "Profile" },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = current === tab.id;
          const hasBadge = tab.id === "cart" && count > 0;

          return (
            <button
              key={tab.id}
              onClick={() => {
                onChange(tab.id);
                haptic();
              }}
              className="relative flex flex-col items-center justify-center flex-1 pt-3"
            >
              <div className="relative">
                <Icon
                  className={`w-7 h-7 transition-all duration-300 ${active ? "text-blue-600 scale-110" : "text-gray-500"}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                {hasBadge && (
                  <span
                    id="cart-tab-badge"
                    className="absolute -top-2 -right-2 min-w-6 h-6 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse"
                  >
                    {count > 99 ? "99+" : count}
                  </span>
                )}
                {active && (
                  <motion.div
                    layoutId="bottomTabIndicator"
                    className="absolute -inset-4 bg-blue-100/70 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${active ? "text-blue-600" : "text-gray-500"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}