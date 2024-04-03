"use server"

import { z } from "zod"
import { prisma } from "@/lib/db"
import { SettingsSchema } from "@/schemas"
import { getUserByEmail, getUserById } from "@/data/user"
import { currentUser } from "@/lib/auth"
import { generateVerificationToken } from "@/lib/tokens"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/lib/mail"
import { update } from "@/auth"

export const settings = async (value: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser()
    if (!user) return { error: "Not logged in" }

    const dbUser = await getUserById(user.id)
    if (!dbUser) return { error: "User not found" }

    const isOAuth = user.isOAuth
    if (isOAuth) {
        value.email = undefined
        value.password = undefined
        value.newPassword = undefined
    }

    value.email = undefined
    value.country = undefined

    const parsedData = SettingsSchema.safeParse(value)
    if (!parsedData.success) return { error: parsedData.error.issues[0].message }

    const values = parsedData.data

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email)
        if (existingUser && existingUser.id !== user.id) return { error: "Email already exists" }

        const verificationToken = await generateVerificationToken(values.email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        return { success: "Verification email sent!" }
    }

    if (values.password && values.newPassword && dbUser.password) {
        const passwordMath = await bcrypt.compare(values.password, dbUser.password)
        if (!passwordMath) return { error: "Wprowadziłeś niepoprawne hasło" }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10)
        values.password = hashedPassword
        values.newPassword = undefined
    }

    await prisma.user.update({
        where: { id: dbUser.id },
        data: { ...values }
    })

    // if (values.firstname && values.lastname && values.phone && values.street && values.zipCode && values.city && values.country) {
    //     await stripe.customers.update(dbUser.stripeCustomerId, {
    //         name: `${values.firstname} ${values.lastname}`,
    //         phone: values.phone,
    //         shipping: {
    //             address: {
    //                 line1: values.street,
    //                 postal_code: values.zipCode,
    //                 city: values.city,
    //                 country: values.country
    //             },
    //             name: `${values.firstname} ${values.lastname}`,
    //             phone: values.phone
            
    //         }
    //     })
    // }

    await update({
        user: {
            ...values
        }
    })

    return { success: "Zaktualizowano dane pomyślnie!" }
}