"use server"

import { signIn } from "@/auth"
import { getUserByEmail } from "@/data/user"
import { sendVerificationEmail } from "@/lib/mail"
import { generateVerificationToken } from "@/lib/tokens"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
import { LoginSchema } from "@/schemas"
import { AuthError } from "next-auth"
import { z } from "zod"
import { verify2fa } from "./manage-2fa"
import { get2faConfirmationByUserId } from "@/data/2fa-confirmation"
import { prisma } from "@/lib/db"

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
    const validationSchema = LoginSchema.safeParse(values)

    if (!validationSchema.success) {
        console.error("Invalid fields!")
        return { error: "Niepoprawne pola!" }
    }

    const { email, password, code } = validationSchema.data

    const existingUser = await getUserByEmail(email)
    if (!existingUser || !existingUser.email || !existingUser.password) { return { error: "Zły email lub hasło!" } }

    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
        
        return { success: "Wysłano email weryfikacyjny!" }
    }

    if (existingUser.isTwoFactorEnabled && existingUser.twoFactorSecret) {
        const existingTwoFactorConfirmation = await get2faConfirmationByUserId(existingUser.id)
        if (!existingTwoFactorConfirmation) {
            if (code) {
                const verified = await verify2fa(existingUser.email, code)
                if (verified.twoFactorError) return { twoFactorError: verified.twoFactorError }
            } else {
                return { twoFactor: true }
            }
        } else {
            const expired = new Date(existingTwoFactorConfirmation.expires) < new Date()
            if (expired) {
                await prisma.twoFactorConfirmation.delete({
                    where: { id: existingTwoFactorConfirmation.id }
                })
                return { twoFactor: true }
            }
        }
    }
    
    try {
        await signIn("credentials", { email, password, redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    console.error("Invalid credentials!")
                    return { error: "Zły email lub hasło!" }
                default:
                    console.error("Something went wrong!")
                    return { error: "Something went wrong!" }
            }
        }

        throw error
    }
}