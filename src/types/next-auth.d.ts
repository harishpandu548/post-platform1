import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      email: string;
    };
  }

  interface User {
    id: string;
    role: "USER" | "ADMIN";
  }
}
