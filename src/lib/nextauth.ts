import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  loginAPI,
  refreshTokenAPI,
  decodeJWT,
  isTokenExpiredByDate,
  shouldRefreshToken,
} from "@/lib/auth";
import type { LoginCredentials } from "@/types/auth";

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const loginData: LoginCredentials = {
            username: credentials.username,
            password: credentials.password,
          };

          const response = await loginAPI(loginData);

          if (response.success && response.data.token) {
            // Decode JWT to get user info
            const userInfo = decodeJWT(response.data.token);

            if (!userInfo) {
              return null;
            }

            // Return user object that will be saved in JWT
            return {
              id: userInfo.username, // Using username as ID
              username: userInfo.username,
              verified: userInfo.verified,
              token: response.data.token,
              expiresIn: response.data.expiresIn,
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.verified = user.verified;
        token.token = user.token;
        token.expiresIn = user.expiresIn;
      }

      // Check if token is completely expired
      if (token.expiresIn && isTokenExpiredByDate(token.expiresIn)) {
        console.log("Token is expired, forcing re-login");
        throw new Error("Token expired");
      }

      // Check if token needs refresh based on expiresIn date string
      if (
        token.token &&
        token.expiresIn &&
        shouldRefreshToken(token.expiresIn)
      ) {
        try {
          console.log("Token will expire soon, attempting refresh...");
          const refreshResponse = await refreshTokenAPI(token.token);

          if (refreshResponse.success) {
            // Update token with new data
            const newUserInfo = decodeJWT(refreshResponse.data.token);

            if (newUserInfo) {
              token.token = refreshResponse.data.token;
              token.expiresIn = refreshResponse.data.expiresIn;
              token.username = newUserInfo.username;
              token.verified = newUserInfo.verified;
              console.log("Token refreshed successfully");
            }
          } else {
            // Refresh failed, return null to force re-login
            console.log("Token refresh failed");
            throw new Error("Token refresh failed");
          }
        } catch (error) {
          console.error("Token refresh error:", error);
          throw new Error("Token refresh failed");
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.verified = token.verified;
        session.user.token = token.token;
        session.user.expiresIn = token.expiresIn;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authConfig);

export const { auth, signIn, signOut } = NextAuth(authConfig);

// Create handlers for API routes
const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
