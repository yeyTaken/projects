import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";


// Extende o Session e User para incluir dados do DB
declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? null;
        session.user.name = token.name ?? null;
        session.user.email = token.email ?? null;
        session.user.image = token.picture ?? null;

      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name ?? null;
        token.email = user.email ?? null;
        token.picture = user.image ?? null;
      }
      return token;
    },
  },
};
