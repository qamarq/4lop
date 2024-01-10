"use server"

import { RegisterSchema } from "@/schemas"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { getUserByEmail } from "@/data/user"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import { stripe } from "@/lib/stripe"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validationSchema = RegisterSchema.safeParse(values)

    if (!validationSchema.success) {
        // return { error: validationSchema.error.formErrors.fieldErrors}
        return { error: "Invalid fields!" }
    }

    const { 
        email, 
        password, 
        firstname,
        lastname,
        street,
        city,
        zip,
        phone,
        accountType,
        newsLetter
    } = validationSchema.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)
    if (existingUser) { return { error: "Istnieje użytkownik z takim adresem email" } }

    try {
        const customer = await stripe.customers.create({
            name: `${firstname} ${lastname}`,
            email,
            phone,
            address: {
                city,
                country: "PL",
                line1: street,
                postal_code: zip
            },
            preferred_locales: ["pl"],
            shipping: {
                name: `${firstname} ${lastname}`,
                phone,
                address: {
                    city,
                    country: "PL",
                    line1: street,
                    postal_code: zip
                },
            }
        });

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: `${firstname} ${lastname}`,
                firstname,
                lastname,
                street,
                city,
                zipCode: zip,
                phone,
                accountType,
                newsletter: newsLetter,
                stripeCustomerId: customer.id
            }
        })
    
        const verificationToken = await generateVerificationToken(email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)
    
        return { success: "Wysłano email z potwierdzeniem!" }
    } catch (error) {
        console.log(error)
        return { error: "Nie udało się utworzyć konta" }
    }
}