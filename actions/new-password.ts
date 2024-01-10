"use server"

import { getPasswordResetTokenByToken } from "@/data/password-reset"
import { getUserByEmail } from "@/data/user"
import { NewPasswordSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

export const newPassword = async (values: z.infer<typeof NewPasswordSchema>, token: string) => {
    if (!token) { return { error: "Niepoprawny token." } }

    const validatedFields = NewPasswordSchema.safeParse(values)
    if (!validatedFields.success) { return { error: "Invalid password" } }

    const { password } = validatedFields.data

    const exsitingToken = await getPasswordResetTokenByToken(token)
    if (!exsitingToken) { return { error: "Niepoprawny token." } }

    const hasExpired = new Date(exsitingToken.expires) < new Date()
    if (hasExpired) { return { error: "Token stracił swój czas wykorzystania." } }

    const existingUser = await getUserByEmail(exsitingToken.email)
    if (!existingUser) { return { error: "Niepoprawny token." } }

    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id: existingUser.id }, data: { password: hashedPassword } })
    await prisma.passwordResetToken.delete({ where: { id: exsitingToken.id } })

    return { success: "Hasło zostało zaktualizowane!" }
}