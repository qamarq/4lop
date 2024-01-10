import { prisma } from "@/lib/db"

export const get2faConfirmationByUserId = async (userId: string) => {
    try {
        const confirmation = await prisma.twoFactorConfirmation.findFirst({
            where: { userId }
        })
        return confirmation
    } catch (error) {
        return null
    }
}