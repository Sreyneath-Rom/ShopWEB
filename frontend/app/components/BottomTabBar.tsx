// app/components/BottomTabBar.tsx
"use client";

import { motion } from "framer-motion";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import { useEffect, useState } from "react";

export function BottomTabBar({
  current,
  onChange,
}: {
  current: string;
  onChange: (v: string) => void;
}) {
  const { count } = useCart();

  // Prevent hydration mismatch: badge only shows after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tabs = [
    { id: "home",    label: "Home",    icon: Home },
    { id: "search",  label: "Search",  icon: Search },
    { id: "cart",    label: "Cart",    icon: ShoppingCart },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="relative flex justify-around items-center h-20 px-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === current;
          const showBadge = tab.id === "cart" && count > 0;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 py-2"
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                />

                {/* Cart badge – only render after client mount */}
                {showBadge && (
                  <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    {count}
                  </span>
                )}
              </div>

              <span
                className={`text-xs mt-1 font-medium transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-500"
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="bottomTabIndicator"
                  className="absolute -inset-x-4 bottom-0 h-1 bg-blue-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}