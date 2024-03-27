"use server"

import { ContactSchema } from "@/schemas"
import { z } from "zod"
import { verifyCaptcha } from "./recaptcha"
import { prisma } from "@/lib/db"
import { currentRole } from "@/lib/auth"
import { UserRole } from "@prisma/client"

export const sendContactForm = async (values: z.infer<typeof ContactSchema>, captcha: string) => {
    const parsedValues = ContactSchema.safeParse(values)
    if (!parsedValues.success) {
        console.log(parsedValues.error)
        return { error: true, message: "Wpisz poprawnie dane" }
    }
    
    const { name, email, phone, text } = parsedValues.data

    const captchaVerified = await verifyCaptcha(captcha)
    if (captchaVerified.error) {
        console.log(captchaVerified.error, captcha)
        return { error: true, message: "Błąd captcha" }
    }

    await prisma.contactForm.create({
        data: {
            name,
            email,
            phone: phone || "",
            message: text,
        },
    })

    return { success: true }
}

export const deleteMessage = async (messageId: string) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) {
        return { error: true, message: "Brak uprawnień" }
    }

    await prisma.contactForm.delete({ where: { id: messageId } })
    return { success: true }
}