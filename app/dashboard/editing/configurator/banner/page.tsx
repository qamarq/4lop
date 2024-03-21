import React from 'react'
import styles from "@/styles/Account.module.scss"
import { cn } from '@/lib/utils'
import ConfiguratorBanerForm from '@/components/dashboard/editing/ConfiguratorBanerForm'
import { prisma } from '@/lib/db'

export default async function BannerConfiguratorPage() {
    const configuratorBannerImg = (await prisma.pageContent.findFirst({ where: { elementId: 'configuratorBannerImg' } }))?.content || ""

    return (
        <div className={styles.content}>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Konfigurator - Baner
                </h2>
            </div>

            <ConfiguratorBanerForm configuratorBannerImg={configuratorBannerImg} />
        </div>
    )
}
