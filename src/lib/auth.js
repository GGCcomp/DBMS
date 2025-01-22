import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const {NEXT_PUBLIC_HOST_URL} = process.env;

export const authOptions = {
  secret: process.env.AUTH_SECRET,
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

          // Return user object with the necessary fields
          return {
            email: result.email,
            name: result.name, // Ensure this is the correct field from your response
            role: result.role,
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
      session.user.role = token.role; // Add the role to the session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Store the role in the token
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
