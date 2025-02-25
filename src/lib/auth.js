import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const {NEXT_PUBLIC_HOST_URL} = process.env;

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Extract credentials
        const { email, password, fcmToken } = credentials;

        try {
          const res = await fetch(`${NEXT_PUBLIC_HOST_URL}/api/login`, {
            cache: 'no-store',
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, fcmToken }), // Send only email and password
          });

          const result = await res.json();

          if (!res.ok || !result.ok) {
            throw new Error(result.message || "Invalid credentials");
          }

          return {
            id: result.id,
            email: result.email,
            name: result.name, 
            department: result.department,
            role: result.role,
            permission: result.permission
          };
        } catch (error) {
          console.error("Authorize error:", error.message);
          throw new Error("Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.department = token.department;
      session.user.role = token.role; 
      session.user.permission = token.permission
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.department = user.department
        token.role = user.role; 
        token.permission = user.permission;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
