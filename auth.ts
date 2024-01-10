import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import { getUserById } from "./data/user"
import { UserRole } from "@prisma/client"
import { get2faConfirmationByUserId } from "./data/2fa-confirmation"
import { getAccountByUserId } from "./data/account"

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
    update
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    },
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider !== "credentials") return true

            const existingUser = await getUserById(user.id)
            if (!existingUser?.emailVerified) return false

            if (existingUser?.isTwoFactorEnabled) {
                const existingTwoFactorConfirmation = await get2faConfirmationByUserId(user.id)
                if (!existingTwoFactorConfirmation) return false

                const hasExpired = new Date(existingTwoFactorConfirmation.expires) < new Date()
                if (hasExpired) {
                    await prisma.twoFactorConfirmation.delete({
                        where: { id: existingTwoFactorConfirmation.id }
                    })
                    return false
                }
            }

            return true
        },
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }

            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }

            if (token.isTwoFactorEnabled && session.user) {
                session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
            }

            if (session.user) {
                session.user.isOAuth = token.isOAuth as boolean
                session.user.image = token.image as string | null | undefined

                session.user.firstname = token.firstname as string
                session.user.lastname = token.lastname as string
                session.user.street = token.street as string
                session.user.city = token.city as string
                session.user.zipCode = token.zipCode as string
                session.user.country = token.country as string
                session.user.phone = token.phone as string
                session.user.accountType = token.accountType as string
                session.user.newsletter = token.newsletter as boolean
                session.user.stripeCustomerId = token.stripeCustomerId as string
            }

            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token

            const user = await getUserById(token.sub)
            if (!user) return token

            const exisingAccount = await getAccountByUserId(user.id)

            token.name = user.name
            token.email = user.email
            token.image = user.image
            token.role = user.role
            token.isOAuth = !!exisingAccount
            token.isTwoFactorEnabled = user.isTwoFactorEnabled

            token.firstname = user.firstname
            token.lastname = user.lastname
            token.street = user.street
            token.city = user.city
            token.zipCode = user.zipCode
            token.country = user.country
            token.phone = user.phone
            token.accountType = user.accountType
            token.newsletter = user.newsletter
            token.stripeCustomerId = user.stripeCustomerId
    
            return token
        }
    },
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
})