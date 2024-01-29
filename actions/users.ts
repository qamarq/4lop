"use server"

import { currentRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

export const getAllUsers = async () => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Unauthorized" }

    const users = await prisma.user.findMany({})

    return { success: true, users }
} 

export const updateRole = async (id: string, roleToUpdate: UserRole) => {
    try {
        const role = await currentRole()
        if (role !== UserRole.ADMIN) return { error: "Unauthorized" }

        await prisma.user.update({
            where: { id },
            data: { role: roleToUpdate }
        })

        revalidatePath("/dashboard/users/"+id)
        return { success: true }
    } catch (error) {
        return { error: true }
    }
}