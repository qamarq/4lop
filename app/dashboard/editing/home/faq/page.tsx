import React from 'react'
import styles from "@/styles/Account.module.scss"
import { cn } from '@/lib/utils'
import FAQForm from '@/components/dashboard/editing/FAQForm'
import { prisma } from '@/lib/db'

export default async function EditHomeHero() {
    const faqContent = JSON.parse((await prisma.pageContent.findFirst({ where: { elementId: 'faqContent' } }))?.content || '[]') as {id: string, title: string, content: string}[]
    
    return (
        <div className={styles.content}>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Strona główna - Pytania i odpowiedzi
                </h2>
            </div>

            <FAQForm content={faqContent} />
        </div>
    )
}
