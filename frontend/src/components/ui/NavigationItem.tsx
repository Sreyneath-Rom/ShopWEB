// frontend/src/components/ui/NavigationItem.tsx
"use client";
import Link from "next/link";
import { ReactNode } from "react";

interface NavigationItemProps {
  href: string;
  children: ReactNode;
}

export default function NavigationItem({ href, children }: NavigationItemProps) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-900 hover:text-blue-600 transition font-medium"
      >
        {children}
      </Link>
    </li>
  );
}
