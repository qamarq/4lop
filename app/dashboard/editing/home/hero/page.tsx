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
            <div className={cn(styles.header_content, "justify-between")}>
                <h1 className={styles.content_title}>Strona główna - Hero</h1>
            </div>

            <HeroForm heroTitle={heroTitle} heroSubtitle={heroSubtitle} heroButtonText={heroButtonText} heroButtonLink={heroButtonLink} />
        </div>
    )
}
