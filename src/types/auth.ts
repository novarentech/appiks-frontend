import { DefaultSession } from "next-auth"

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      username: string
      verified: boolean
      token: string
      expiresIn: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    username: string
    verified: boolean
    token: string
    expiresIn: string
  }
}

// Extend the built-in JWT types
declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    verified: boolean
    token: string
    expiresIn: string
    refreshToken?: string
  }
}

// API Response Types
export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    expiresIn: string
  }
}

export interface RefreshResponse {
  success: boolean
  message: string
  data: {
    token: string
    expiresIn: string
  }
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface JWTPayload {
  username: string
  verified: boolean
  exp: number
  iat: number
  [key: string]: unknown
}
