import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({
    name: "credentials",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) throw new Error("Invalid credentials");
      
      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
        select: { id: true, email: true, password: true, name: true, role: true, image: true, isActive: true },
      });

      if (!user?.password) throw new Error("Invalid credentials");
      const valid = await bcrypt.compare(credentials.password, user.password);
      if (!valid) throw new Error("Invalid credentials");
      if (!user.isActive) throw new Error("Account deactivated");

      prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() }, select: { id: true } }).catch(console.error);

      return { id: user.id, email: user.email, name: user.name, role: user.role, image: user.image };
    },
  })],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role; token.email = user.email; token.name = user.name; token.image = user.image; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id as string; session.user.role = token.role as string; }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };