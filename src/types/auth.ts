import { DefaultSession } from "next-auth";

// Extend the built-in session types
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
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    verified: boolean;
    token: string;
    expiresIn: string;
    name?: string;
    phone?: string;
    refreshToken?: string;
  }
}

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
  exp: number;
  iat: number;
  [key: string]: unknown;
}

export interface UpdateProfileData {
  username: string;
  phone: string;
  verified: true;
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
    mentor_id: number;
    room_id: number;
    school_id: number;
  };
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    name: string;
    phone: string;
    username: string;
    identifier: string;
    verified: boolean;
    role: string;
    mentor : {
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
    room:{
      id: number;
      name: string;
      school_id: number;
    }
    school: {
      id: number;
      name: string;
    };
  };
}
