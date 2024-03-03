import React from 'react'
import styles from "@/styles/Account.module.scss"
import { cn } from '@/lib/utils'
import AboutForm from '@/components/dashboard/editing/AboutForm'
import { prisma } from '@/lib/db'

export default async function AboutEditing() {
    const aboutContent = JSON.parse((await prisma.pageContent.findFirst({ where: { elementId: 'aboutContent' } }))?.content || '[]') as {id: string, title: string, content: string, image: string, icon: string}[]
    
    return (
        <div className={styles.content}>
            <div className={cn(styles.header_content, "justify-between")}>
                <h1 className={styles.content_title}>O nas - treść</h1>
            </div>

            <AboutForm aboutContent={aboutContent} />
        </div>
    )
}
