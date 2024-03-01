import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/helpers/auth"; // Import your login function

const authHandler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Call your login function passing credentials
          const user = await loginUser(credentials);

          // If login successful, return user object
          if (user) {
            return user;
          } else {
            // If login fails, throw an error
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          // Catch and throw any errors that occur during login process
          throw new Error(error.message || "Something went wrong while trying to log in");
        }
      }
    })
  ],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async jwt({ token, user }) {
      // Merge user data into token
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // Set user data in session
      session.user = token;
      return session;
    }
  }
});

export { authHandler as GET, authHandler as POST };
