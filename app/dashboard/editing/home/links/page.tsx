import React from 'react'
import styles from "@/styles/Account.module.scss"
import { cn } from '@/lib/utils'
import LinksForm from '@/components/dashboard/editing/LinksForm'
import { prisma } from '@/lib/db'

export default async function EditHomeHero() {
    const firstBannerValue = (await prisma.pageContent.findFirst({ where: { elementId: 'linkFirstBanner' } }))?.content
    const secondBannerValue = (await prisma.pageContent.findFirst({ where: { elementId: 'linkSecondBanner' } }))?.content
    const thirdBannerValue = (await prisma.pageContent.findFirst({ where: { elementId: 'linkThirdBanner' } }))?.content

    const firstBanner = JSON.parse(firstBannerValue || '{"title": "", "image": "", "link": ""}') as {title: string, image: string, link: string}
    const secondBanner = JSON.parse(secondBannerValue || '{"title": "", "image": "", "link": ""}') as {title: string, image: string, link: string}
    const thirdBanner = JSON.parse(thirdBannerValue || '{"title": "", "image": "", "link": ""}') as {title: string, image: string, link: string}

    return (
        <div className={styles.content}>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Strona główna - Szybki linki
                </h2>
            </div>

            <LinksForm firstBanner={firstBanner} secondBanner={secondBanner} thirdBanner={thirdBanner}  />
        </div>
    )
}