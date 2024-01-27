"use server"

import { currentRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"

export const getAllUsers = async () => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Unauthorized" }

    const users = await prisma.user.findMany({})

    return { success: true, users }
} 