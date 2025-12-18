import { prisma } from "@/lib/prisma";
import NextAuth, { type NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions=({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) {
          throw new Error("Missing credentials");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("User not found");
        }
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session:{
    strategy:"jwt",
  },
  callbacks:{
    async jwt({token,user}) {
        if(user){
          token.id = (user as any).id;
            token.role=(user as any).role;
        }
        return token
        
    },
    async session({session,token}) {
        if(session.user){
          (session.user as any).id = token.id;
            (session.user as any).role=token.role as "USER" | "ADMIN";
        }
        return session
        
    }
  },
  pages:{
    signIn:"/login"
  }
});

const handler=NextAuth(authOptions)

export { handler as GET, handler as POST };
