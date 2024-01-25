"use server"

import { getProductById } from "@/data/products"
import { prisma } from "@/lib/db"

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
        const products = await prisma.products.findMany()
        return { success: true, products: products.map((product) => { return { name: product.productName, id: product.productId } }) }
    } catch(err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}