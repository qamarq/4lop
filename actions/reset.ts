"use server"

import { ResetSchema } from "@/schemas"
import { z } from "zod"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values)
    if (!validatedFields.success) return { error: "Invalid email!" }

    const { email } = validatedFields.data
    const user = await getUserByEmail(email)
    if (!user) return { 
        // error: "User not found!"
        success: "Wysłano email jeśli użytkownik istnieje!"
     }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return { success: "Wysłano email jeśli użytkownik istnieje!" }
}