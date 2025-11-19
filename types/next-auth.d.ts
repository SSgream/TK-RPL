import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: int
      name: string
      email?: string
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    id: int
    name: string
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: int
    name: string
    role: string
  }
}
