"use server"

import { getProductById } from "@/data/products"

export const getOneProduct = async (id: number) => {
    try {
        const product = await getProductById(id)
        return { success: true, product }
    } catch(err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}