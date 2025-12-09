// app/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { readUsers, writeUsers } from "./users";

// បន្ថែម type នេះនៅលើកំពូល!
declare module "next-auth" {
  interface User {
    isAdmin?: boolean;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        token: { label: "2FA Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const users = readUsers();
        const user = users.find((u: any) => u.email === credentials.email);
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;

        if (user.twoFactorEnabled) {
          if (!credentials.token) return null;
          const valid = authenticator.check(credentials.token as string, user.twoFactorSecret);
          if (!valid) return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          isAdmin: !!user.isAdmin, // ← ឥឡូវ TypeScript យល់ហើយ!
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin; // ← ឥឡូវដំណើរការ!
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      if (token.isAdmin !== undefined) session.user.isAdmin = token.isAdmin; // ← ល្អ!
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});