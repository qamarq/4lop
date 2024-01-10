"use server"

import { prisma } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { getVerificationTokenByToken } from "@/data/verification-token"

export const verifyEmail = async (token: string) => {
    const verificationToken = await getVerificationTokenByToken(token)
    if (!verificationToken) return { error: "Invalid token!" }

    const hasExpired = new Date(verificationToken.expires) < new Date()
    if (hasExpired) return { error: "Token expired!" }

    const user = await getUserByEmail(verificationToken.email)
    if (!user) return { error: "Invalid token!" }

    await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date(), email: verificationToken.email }
    })

    await prisma.verificationToken.delete({
        where: { id: verificationToken.id }
    })

    return { success: "Email verified!" }
}