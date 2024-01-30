"use server"

import { getProductById } from "@/data/products"
import { currentRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formattedPrice } from "@/lib/utils"
import { AdminProductsSchema } from "@/schemas"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"

export const getOneProduct = async (id: number) => {
    try {
        const product = await getProductById(id)
        return { success: true, product }
    } catch(err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}

export const getAllProductsInDB = async () => {
    try {
        const role = await currentRole()
        if (role !== UserRole.ADMIN) return { error: "Nie masz uprawnień do wykonania tej akcji!" }
        const products = await prisma.products.findMany()
        return { success: true, products: products.map((product) => { return { name: product.productName, id: product.productId, originalId: product.id } }) }
    } catch(err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}

export const getProductByIdAdmin = async (id: number) => {
    try {
        const role = await currentRole()
        if (role !== UserRole.ADMIN) return { error: "Nie masz uprawnień do wykonania tej akcji!" }
        const product = await getProductById(id)
        if (!product) return { error: "Nie znaleziono produktu!" }
        return { success: true, product }
    } catch(err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}

export const updateProductData = async (id: string, values: z.infer<typeof AdminProductsSchema>) => {
    try {
        const role = await currentRole()
        if (role !== UserRole.ADMIN) return { error: "Nie masz uprawnień do wykonania tej akcji!" }

        const validationSchema = AdminProductsSchema.safeParse(values)

        if (!validationSchema.success) {
            console.error("Invalid fields!")
            return { error: "Niepoprawne pola!" }
        }

        const { price, amount } = validationSchema.data
        const product = await prisma.products.findUnique({ where: { id } })
        if (!product) return { error: "Nie znaleziono produktu!" }
        
        const priceGrossValue = price
        const priceNetValue = price - (price * (product.taxPercent / 100))
        const priceTaxValue = price * (product.taxPercent / 100)
        const priceGrossFormatted = formattedPrice(priceGrossValue)
        const priceNetFormatted = formattedPrice(priceNetValue)
        const priceTaxFormatted = formattedPrice(priceTaxValue)

        await prisma.products.update({ where: { id }, data: {
            priceGrossValue, 
            priceNetValue, 
            priceTaxValue, 
            priceGrossFormatted, 
            priceNetFormatted, 
            priceTaxFormatted, 
            amount 
        } })

        revalidatePath("/dashboard/products/"+id)

        return { success: "Zaktualizowano produkt o numerze "+product.productId+"!" }
    } catch(err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}