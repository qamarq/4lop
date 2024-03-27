"use server"

import { currentRole } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createSlugLink } from "@/lib/utils"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

//PRODUKTY

export const getProductsPagination = async (page: number, limit: number, options: { sort: string, category: string }) => {
    const sortName = options.sort.split("_")[0] // bestFit (no sorting), price, name, date
    const sortType = options.sort.split("_")[1] // asc, desc

    let sortNameDB = sortName
    if (sortName === "bestFit") sortNameDB = "id"
    if (sortName === "date") sortNameDB = "createdAt"

    const results = await prisma.product.findMany({
        skip: (page) * limit,
        take: limit,
        orderBy: { [sortNameDB]: sortType },
        where: { categoryId: options.category !== "default" ? options.category : undefined }
    })

    const resultPage = results.length

    return {
        results: { resultCount: resultPage, resultPage, currentPage: page, limitPerPage: limit },
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

// KATEGORIE

export const addCategory = async (name: string) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak uprawnień" }

    if (!name || name === "") return { error: "Wymagana jest nazwa kategorii" }

    const exists = await prisma.category.findFirst({ where: { name } })
    if (exists) return { error: "Kategoria o tej nazwie już istnieje" }

    const category = await prisma.category.create({ data: { name } })
    revalidatePath("/dashboard/categories")
    return { success: "Utworzono kategorię: " + name, category }
}

export const deleteCategory = async (id: string) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak uprawnień" }
    
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) return { error: "Kategoria nie istnieje" }

    await prisma.category.delete({ where: { id } })
    revalidatePath("/dashboard/categories")
    return { success: "Usunięto kategorię: " + category.name }
}

export const getAllCategories = async () => {
    return await prisma.category.findMany()
}

// GRUPY

export const addGroup = async (name: string, variants: string[]) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak uprawnień" }

    if (!name || name === "") return { error: "Wymagana jest nazwa grupy" }
    if (variants.length === 0) return { error: "Wymagane są warianty" }

    const exists = await prisma.group.findFirst({ where: { name } })
    if (exists) return { error: "Grupa o tej nazwie już istnieje" }

    const group = await prisma.group.create({ data: { name, variants } })
    revalidatePath("/dashboard/groups")
    return { success: "Utworzono grupę: " + name, group }
}

export const editGroup = async (id: string, name: string, variants: string[]) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak uprawnień" }

    if (!name || name === "") return { error: "Wymagana jest nazwa grupy" }
    if (variants.length === 0) return { error: "Wymagane są warianty" }

    const group = await prisma.group.findUnique({ where: { id } })
    if (!group) return { error: "Grupa nie istnieje" }

    await prisma.group.update({ where: { id }, data: { name, variants } })
    revalidatePath("/dashboard/groups")
    return { success: "Zaktualizowano grupę: " + name }
}

export const deleteGroup = async (id: string) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak uprawnień" }

    const group = await prisma.group.findUnique({ where: { id } })
    if (!group) return { error: "Grupa nie istnieje" }

    await prisma.group.delete({ where: { id } })
    revalidatePath("/dashboard/groups")
    return { success: "Usunięto grupę: " + group.name }
}

export const getAllGroups = async () => {
    return await prisma.group.findMany()
}