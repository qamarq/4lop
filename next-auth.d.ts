import NextAuth, { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
    isTwoFactorEnabled: boolean
    isOAuth: boolean
    firstname: string
    lastname: string
    street: string
    city: string
    zipCode: string
    country: string
    phone: string
    accountType: string
    newsletter: boolean
    stripeCustomerId: string
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}