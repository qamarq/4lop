import React from 'react'
import styles from "@/styles/Account.module.scss"
import { cn } from '@/lib/utils'
import FooterForm from '@/components/dashboard/editing/FooterForm'
import { prisma } from '@/lib/db'

export default async function FooterContentPage() {
    const socialMediaFooter = JSON.parse((await prisma.pageContent.findFirst({ where: { elementId: 'socialMediaFooter' } }))?.content || '[]') as {id: string, label: string, image: string, link: string}[]
    const contactFooter = JSON.parse((await prisma.pageContent.findFirst({ where: { elementId: 'contactFooter' } }))?.content || '[]') as {id: string, label: string, image: string}[]

    return (
        <div className={styles.content}>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Stopka - treść
                </h2>
            </div>

            <FooterForm socialMediaFooter={socialMediaFooter} contactFooter={contactFooter} />
        </div>
    )
}
