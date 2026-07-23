import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
  loginAPI,
  refreshTokenAPI,
  decodeJWT,
  isTokenExpiredByDate,
  shouldRefreshToken,
} from "@/lib/auth";
import type { LoginCredentials, CustomUser } from "@/types/auth";

interface CustomSession {
  user: {
    id: string;
    username: string;
    name: string;
    verified: boolean;
    token: string;
    expiresIn: string;
    room: string;
    mentor: string;
    school: string;
    phone: string;
    role: string;
  };
  expires: string;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const loginData: LoginCredentials = {
            username: credentials.username as string,
            password: credentials.password as string,
          };

          const response = await loginAPI(loginData);

          if (response.success && response.data.token) {
            const userInfo = decodeJWT(response.data.token);

            if (!userInfo) return null;

            return {
              id: String(userInfo.sub || userInfo.id || userInfo.user_id || userInfo.username),
              username: userInfo.username,
              verified: userInfo.verified,
              token: response.data.token,
              expiresIn: response.data.expiresIn,
              name: userInfo.name,
              room: userInfo.room,
              mentor: userInfo.mentor,
              school: userInfo.school,
              role: userInfo.role,
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
      if (user) {
        const customUser = user as CustomUser;
        token.id = customUser.id;
        token.username = customUser.username;
        token.verified = customUser.verified;
        token.token = customUser.token;
        token.expiresIn = customUser.expiresIn;
        token.name = customUser.name;
        token.phone = customUser.phone;
        token.room = customUser.room;
        token.mentor = customUser.mentor;
        token.school = customUser.school;
        token.role = customUser.role;
      }

      if (token.expiresIn && isTokenExpiredByDate(token.expiresIn as string)) {
        throw new Error("Token expired");
      }

      if (
        token.token &&
        token.expiresIn &&
        shouldRefreshToken(token.expiresIn as string)
      ) {
        try {
          const refreshResponse = await refreshTokenAPI(token.token as string);
          if (refreshResponse.success) {
            const newUserInfo = decodeJWT(refreshResponse.data.token);
            if (newUserInfo) {
              token.token = refreshResponse.data.token;
              token.expiresIn = refreshResponse.data.expiresIn;
              token.id = String(newUserInfo.sub || newUserInfo.id || newUserInfo.user_id || newUserInfo.username);
              token.username = newUserInfo.username;
              token.verified = newUserInfo.verified;
              token.name = newUserInfo.name;
              token.room = newUserInfo.room;
              token.mentor = newUserInfo.mentor;
              token.school = newUserInfo.school;
              token.role = newUserInfo.role;
            }
          } else {
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
      if (token && session.user) {
        const customSession = session as CustomSession;
        customSession.user.id = token.id as string;
        customSession.user.username = token.username as string;
        customSession.user.verified = token.verified as boolean;
        customSession.user.token = token.token as string;
        customSession.user.expiresIn = token.expiresIn as string;
        customSession.user.name = token.name as string;
        customSession.user.phone = token.phone as string;
        customSession.user.room = token.room as string;
        customSession.user.mentor = token.mentor as string;
        customSession.user.school = token.school as string;
        customSession.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
});
