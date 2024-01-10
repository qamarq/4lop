"use server"

import { auth, update } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { prisma } from "@/lib/db"
import speakeasy from "speakeasy"

export const generateTwoFactor = async () => {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    const existingUser = await getUserByEmail(session.user.email || "")
    if (!existingUser) return { error: "User not found" }

    if (existingUser.isTwoFactorEnabled) return { error: "2FA already enabled" }

    const secret = speakeasy.generateSecret({
        name: `4lop: ${existingUser.email}`
    })

    return { success: secret }
}

export const saveTwoFactor = async (code: string, secret: string) => {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    const existingUser = await getUserByEmail(session.user.email || "")
    if (!existingUser) return { error: "User not found" }

    if (existingUser.isTwoFactorEnabled) return { error: "2FA enabled" }

    const verified = speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token: code
    })

    if (!verified) return { error: "Podany kod jest nieprawidłowy" }

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { isTwoFactorEnabled: true, twoFactorSecret: secret, twoFactorProviders: [...existingUser.twoFactorProviders, "APP"] }
    })

    await update({
        user: {
            isTwoFactorEnabled: true,
        }
    })

    return { success: "Code verified" }
}

export const disableTwoFactor = async () => {
    const session = await auth()
    if (!session) return { error: "Unauthorized" }

    const existingUser = await getUserByEmail(session.user.email || "")
    if (!existingUser) return { error: "User not found" }

    if (!existingUser.isTwoFactorEnabled || !existingUser.twoFactorSecret) return { error: "2FA not enabled" }

    const newProviders = existingUser.twoFactorProviders.filter(provider => provider !== "APP")

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { isTwoFactorEnabled: false, twoFactorSecret: null, twoFactorProviders: newProviders }
    })

    await prisma.twoFactorConfirmation.deleteMany({ where: { userId: existingUser.id } })

    await update({
        user: {
            isTwoFactorEnabled: false,
        }
    })

    return { success: "2fa disabled" }
}

export const verify2fa = async (email: string, code: string) => {
    const existingUser = await getUserByEmail(email)
    if (!existingUser) return { error: "User not found" }

    if (!existingUser.isTwoFactorEnabled || !existingUser.twoFactorSecret) return { error: "2FA not enabled" }

    const verified = speakeasy.totp.verify({
        secret: existingUser.twoFactorSecret,
        encoding: "base32",
        token: code
    })

    if (!verified) return { twoFactorError: "Podany kod jest nieprawidłowy" }

    await prisma.twoFactorConfirmation.create({
        data: {
            userId: existingUser.id,
            expires: new Date(new Date().getTime() + 3600 * 1000) // 1 hour
        }
    })

    return { success: "Zweryfikowano" }
}