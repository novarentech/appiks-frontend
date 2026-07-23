import { DefaultSession, User as NextAuthUser } from "next-auth";

// User roles enum
export type UserRole =
  | "siswa"
  | "guru_wali"
  | "guru_bk"
  | "kepala_sekolah"
  | "admin";

// Custom user interface that extends NextAuth User
export interface CustomUser extends NextAuthUser {
  username: string;
  verified: boolean;
  token: string;
  expiresIn: string;
  phone?: string;
  room?: string;
  mentor?: string;
  school?: string;
  role: string;
}

// Extend the built-in session types for NextAuth v5
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      verified: boolean;
      token: string;
      expiresIn: string;
      name?: string;
      phone?: string;
      room?: string;
      mentor?: string;
      school?: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username: string;
    verified: boolean;
    token: string;
    expiresIn: string;
    name?: string;
    phone?: string;
    room?: string;
    mentor?: string;
    school?: string;
    role: string;
  }
}

// Note: NextAuth v5 uses @auth/core for JWT types
// We'll handle JWT typing through callbacks

// API Response Types
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expiresIn: string;
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expiresIn: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface JWTPayload {
  username: string;
  verified: boolean;
  name?: string;
  room?: string;
  mentor?: string;
  school?: string;
  role: string;
  exp: number;
  iat: number;
  sub?: number | string;
  id?: number | string;
  user_id?: number | string;
  [key: string]: unknown;
}

export interface UpdateProfileData {
  username: string;
  phone: string;
  password: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    phone: string;
    username: string;
    identifier: string;
    verified: boolean;
    role: string;
  };
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    phone: string;
    username: string;
    identifier: string;
    verified: boolean;
    role: string;
    mentor: {
      identifier: string;
      mentor_id: number;
      name: string;
      phone: string;
      role: string;
      room_id: number;
      school_id: number;
      username: string;
      verified: boolean;
    };
    room: {
      id: number;
      name: string;
      school_id: number;
    };
    school: {
      id: number;
      name: string;
    };
  };
}

export interface CheckUsernameResponse {
  success: boolean;
  message: string;
  data: {
    username: boolean;
  };
}
