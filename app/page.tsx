// app/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Product, Order, User } from "./types";
import { ProductListing } from "./components/ProductListing";
import { ProductDetail } from "./components/ProductDetail";
import { Payment } from "./components/Payment";
import { PaymentSuccess } from "./components/PaymentSuccess";
import { PaymentFailed } from "./components/PaymentFailed";
import { addOrder, getOrders } from "./utils/storage";

import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import Profile from "./components/Profile";
import AdminPanel from "./components/AdminPanel";

import { useCart } from "./context/CartContext";
import { toast } from "sonner";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/* ----------------------------------------------------
 * ENUM FOR VIEWS (Avoid magic strings)
 * -------------------------------------------------- */
enum Screen {
  LISTING = "listing",
  DETAIL = "detail",
  PAYMENT = "payment",
  SUCCESS = "success",
  FAILED = "failed",
  PROFILE = "profile",
  ADMIN = "admin",
}

function HomeContent() {
  /* ----------------------------------------------------
   * STATE
   * -------------------------------------------------- */
  const [view, setView] = useState<Screen>(Screen.LISTING);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const { items, count: totalItems, add: addCart, clear: clearCart } = useCart();
  const { theme, setTheme } = useTheme();

  /* ----------------------------------------------------
   * FETCH ORDERS & CURRENT USER (ONCE)
   * -------------------------------------------------- */
  useEffect(() => {
    setOrders(getOrders() as Order[]);

    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data?.user) setUser(data.user);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  /* ----------------------------------------------------
   * RANDOM LIVE SALES POPUP
   * -------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const names = ["Emma", "Liam", "Sophia", "Noah"];
      const products = [
        "Classic T-Shirt",
        "Sneakers Pro",
        "Leather Jacket",
        "Denim Jeans",
      ];
      const name = names[Math.floor(Math.random() * names.length)];
      const product = products[Math.floor(Math.random() * products.length)];

      toast.success(`${name} just purchased ${product}`, {
        icon: "New Sale",
        duration: 4000,
      });
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  /* ----------------------------------------------------
   * HANDLERS
   * -------------------------------------------------- */

  const handleAddToCart = useCallback(
    (product: Product) => {
      addCart({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });

      toast.success(`${product.name} added to cart!`);
      setView(Screen.LISTING);
    },
    [addCart]
  );

  const handlePaymentSuccess = useCallback(() => {
    items.forEach((item) => {
      addOrder({
        id: Date.now().toString(),
        productId: item.id,
        productSnapshot: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image || "",
          categoryId: 0,
        },
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        tax: +(item.price * item.quantity * 0.1).toFixed(2),
        total: +(item.price * item.quantity * 1.1).toFixed(2),
        date: new Date().toISOString(),
        status: "paid",
      });
    });

    toast.success("Payment successful! Thank you!");
    clearCart();
    setView(Screen.SUCCESS);
  }, [items, clearCart]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }

    setUser(null);
    toast.info("Logged out");
    setView(Screen.LISTING);
  };

  /* ----------------------------------------------------
   * COMMON UI HELPERS
   * -------------------------------------------------- */

  const openDetail = (p: Product) => {
    setSelectedProduct(p);
    setView(Screen.DETAIL);
  };

  const toggleDarkMode = () => setTheme(theme === "dark" ? "light" : "dark");

  const goToListing = () => setView(Screen.LISTING);

  /* ----------------------------------------------------
   * RENDER SECTIONS
   * -------------------------------------------------- */

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => toast.info("Mini cart is handled globally.")}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-linear-to-br from-orange-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-white"
      >
        <ShoppingCart className="w-8 h-8" />
        {!!totalItems && (
          <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center animate-pulse">
            {totalItems}
          </span>
        )}
      </button>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-white/90 dark:bg-black/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg"
      >
        {theme === "dark" ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6" />
        )}
      </button>

      {/* ----------------------------- Screens ----------------------------- */}

      {view === Screen.LISTING && (
        <ProductListing
          onProductSelect={openDetail}
          user={user}
          onOpenLogin={() => setLoginOpen(true)}
          onOpenRegister={() => setRegisterOpen(true)}
          onOpenProfile={() => setView(Screen.PROFILE)}
          onOpenAdmin={() => setView(Screen.ADMIN)}
          onLogout={logout}
        />
      )}

      {view === Screen.DETAIL && selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onAddToCart={() => handleAddToCart(selectedProduct)}
          onBack={goToListing}
        />
      )}

      {view === Screen.PAYMENT && selectedProduct && (
        <Payment
          product={selectedProduct}
          onBack={goToListing}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailed={() => setView(Screen.FAILED)}
        />
      )}

      {view === Screen.SUCCESS && (
        <PaymentSuccess product={selectedProduct!} onBackToHome={goToListing} />
      )}

      {view === Screen.FAILED && (
        <PaymentFailed
          product={selectedProduct!}
          onRetry={() => setView(Screen.PAYMENT)}
          onBackToHome={goToListing}
        />
      )}

      {view === Screen.PROFILE && (
        <Profile user={user || { id: "guest", name: "Guest" }} orders={orders} onBack={goToListing} onLogout={logout} />
      )}

      {view === Screen.ADMIN && <AdminPanel onBack={goToListing} />}

      {/* ----------------------------- Modals ----------------------------- */}

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(u) => {
          setUser(u);
          toast.success(`Welcome ${u.name}!`);
        }}
      />

      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onRegister={(u) => {
          setUser(u);
          toast.success("Account created!");
        }}
      />
    </>
  );
}

export default function Home() {
  return <HomeContent />;
}
