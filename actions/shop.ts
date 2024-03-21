"use server"

import { prisma } from "@/lib/db"
import { createSlugLink } from "@/lib/utils"

export const getProductsPagination = async (page: number, limit: number) => {
    const allResultsCount = await prisma.product.count()
    const results = await prisma.product.findMany({
        skip: (page) * limit,
        take: limit,
    })

    const resultPage = results.length

    return {
        results: { resultCount: allResultsCount, resultPage, currentPage: page, limitPerPage: limit },
        orderBy: { name: "", type: '' },
        filtrContext: { name: "", value: 0 },
        products: results.map((product): ProductDB => { return { ...product, price: product.price.toString() } })
    }
}

export const getOneProduct = async (id: string) => {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return null
    return { ...product, price: product.price.toString() }
}

export const getGroupById = async (id: string) => {
    const group = await prisma.group.findUnique({ where: { id }, include: { products: true } })
    if (!group) return null
    
    return {
        name: group.name,
        variants: group.products.map((product) => { return { name: product.variant, link: createSlugLink(product.name, product.id) } })
    }
}