import { prisma } from "@/lib/db";

export const getAccountByUserId = async (userId: string) => {
    try {
        return await prisma.account.findFirst({
            where: {
                userId
            }
        });
    } catch (error) {
        return null;
    }
}