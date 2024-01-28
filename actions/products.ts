"use server"

import { getProductById } from "@/data/products"
import { currentRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client"

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