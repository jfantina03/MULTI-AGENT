import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = process.env.AUTH_EMAIL ?? "";
        const hash = process.env.AUTH_PASSWORD_HASH ?? "";

        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email.toLowerCase() !== email.toLowerCase()) return null;

        const valid = await bcrypt.compare(credentials.password, hash);
        if (!valid) return null;

        return { id: "1", email };
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
