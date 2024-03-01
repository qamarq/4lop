import React from 'react'
import styles from "@/styles/Account.module.scss"
import { cn } from '@/lib/utils'
import ConfiguratorBanerForm from '@/components/dashboard/editing/ConfiguratorBanerForm'
import { prisma } from '@/lib/db'

export default async function BannerConfiguratorPage() {
    const configuratorBannerImg = (await prisma.pageContent.findFirst({ where: { elementId: 'configuratorBannerImg' } }))?.content || ""

    return (
        <div className={styles.content}>
            <div className={cn(styles.header_content, "justify-between")}>
                <h1 className={styles.content_title}>Konfigurator - Baner</h1>
            </div>

            <ConfiguratorBanerForm configuratorBannerImg={configuratorBannerImg} />
        </div>
    )
}
