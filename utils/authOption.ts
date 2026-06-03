import { FetchError } from "@/lib/FetchError";
import { AuthOptions, SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data?.data) {
          throw new FetchError({ message: data?.message || "Invalid credentials" });
        }

        const { user, tokens } = data.data;
        return { ...user, tokens };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    // 🔹 Triggered whenever a JWT is created or updated
    async jwt({ token, user, account }) {
      // First login (credentials or google)
      if (user) {
        token.user = user;
        if (user.tokens) token.tokens = user.tokens;
      }

      // Google login flow
      if (account?.provider === "google" && account.id_token) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: account.id_token }),
          });

          const data = await res.json();

          if (res.ok && data?.data) {
            const { user, tokens } = data.data;
            token.user = user;
            token.tokens = tokens;
          }
        } catch (err) {
          console.error("Google login failed:", err);
        }
      }

      return token;
    },

    // 🔹 Runs whenever a session is checked or created
    async session({ session, token }) {
      session.user = token.user;
      session.tokens = token.tokens; // uniform for both providers
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: "next-auth.session-token-crmdubai",
      options: {
        domain: process.env.NODE_ENV === 'production' ? ".rensholiday.net" : ".lvh.me",
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === 'production' ? true : false,
      },
    },
  },
};
