"use server"

import { prisma } from "@/lib/db"

export const upsertElementContent = async (elements: {elementId: string, content: string}[]) => {
    // Update or create the element content with the given id
    await Promise.all(elements.map(async (element) => {
        const existingElement = await prisma.pageContent.findFirst({ where: { elementId: element.elementId } })
        if (existingElement) {
            await prisma.pageContent.update({
                where: { id: existingElement.id },
                data: {
                    content: element.content
                }
            })
        } else {
            await prisma.pageContent.create({
                data: {
                    elementId: element.elementId,
                    content: element.content
                }
            })
        }
    }))
    
    return true
}

export const getElementContentByElementId = async (elementId: string) => {
    return (await prisma.pageContent.findFirst({ where: { elementId } }))?.content
}