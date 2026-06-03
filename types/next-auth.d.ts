import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id?: string;
    company?: {
      username: string;
    };
    tokens?: {
      access_token?: string;
      refresh_token?: string;
      expiresAt?: number;
      expiresIn?: number;
    };
  }

  interface Session extends DefaultSession {
    user: User;
    tokens?: User["tokens"];
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
    tokens?: User["tokens"];
    error?: string;
  }
}
