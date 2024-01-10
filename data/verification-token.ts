import { prisma } from "@/lib/db"

export const getVerificationTokenByEmail = async (email: string) => {
    try {
        const token = await prisma.verificationToken.findFirst({
            where: {
                email
            }
        })
        return token
    } catch (error) {
        return null
    }
}

export const getVerificationTokenByToken = async (token: string) => {
    try {
        const tokenQuery = await prisma.verificationToken.findFirst({
            where: {
                token
            }
        })
        return tokenQuery
    } catch (error) {
        return null
    }
}