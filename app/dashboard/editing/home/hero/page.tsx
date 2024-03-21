import React from 'react'
import styles from "@/styles/Account.module.scss"
import { cn } from '@/lib/utils'
import HeroForm from '@/components/dashboard/editing/HeroForm'
import { prisma } from '@/lib/db'

export default async function EditHomeHero() {
    const heroTitle = (await prisma.pageContent.findFirst({ where: { elementId: 'heroTitle' } }))?.content || ""
    const heroSubtitle = (await prisma.pageContent.findFirst({ where: { elementId: 'heroSubtitle' } }))?.content || ""
    const heroButtonText = (await prisma.pageContent.findFirst({ where: { elementId: 'heroButtonText' } }))?.content || ""
    const heroButtonLink = (await prisma.pageContent.findFirst({ where: { elementId: 'heroButtonLink' } }))?.content || ""

    return (
        <div className={styles.content}>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Strona główna - Hero
                </h2>
            </div>

            <HeroForm heroTitle={heroTitle} heroSubtitle={heroSubtitle} heroButtonText={heroButtonText} heroButtonLink={heroButtonLink} />
        </div>
    )
}
