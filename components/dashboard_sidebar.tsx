"use client"

import React, { useEffect } from 'react'
import { usePathname, useRouter } from "next/navigation"
import { ArchiveIcon, HelpCircleIcon, TruckIcon, LifeBuoyIcon, HomeIcon, BoxIcon, PieChartIcon } from 'lucide-react'
import bg from "@/assets/account/bg.jpg"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import styles from "@/styles/Account.module.scss"
import { Skeleton } from './ui/skeleton'
import { useCurrentUser } from '@/hooks/use-current-user'

export default function DashboardSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const user = useCurrentUser()
    const [activePage, setActivePage] = React.useState<string>("")
   
    useEffect(() => {
        if (!pathname) return
        setActivePage(pathname.slice(1).split('/').pop() || "")
    }, [pathname])
    
    return (
        <div className={styles.navigation}>
            <div className={styles.header} style={{backgroundImage: `url(${bg.src})`}}>
                <p>Dashboard</p>
                <h1>{user ? `${user.firstname} ${user.lastname}` : <Skeleton className='h-4 w-20 mt-2' />}</h1>
            </div>
            <Separator className='my-4' />
            <div className={styles.navigation_items}>
                <div className={`${styles.navigation_item} ${activePage == "dashboard" && styles.active}`} onClick={() => router.push("/dashboard")}>
                    <div className={styles.icon}>
                        <HomeIcon className='w-4 h-4' />
                    </div>
                    <h3>Strona główna</h3>
                </div>
                <div className={`${styles.navigation_item} ${activePage == "orders" && styles.active}`} onClick={() => router.push("/dashboard/orders")}>
                    <div className={styles.icon}>
                        <BoxIcon className='w-4 h-4' />
                    </div>
                    <h3>Zamówienia</h3>
                </div>
                <div className={`${styles.navigation_item} ${activePage == "shipments" && styles.active}`} onClick={() => router.push("/dashboard/shipments")}>
                    <div className={styles.icon}>
                        <TruckIcon className='w-4 h-4' />
                    </div>
                    <h3>Opcje dostawy</h3>
                </div>
                <div className={`${styles.navigation_item} ${activePage == "products" && styles.active}`} onClick={() => router.push("/dashboard/products")}>
                    <div className={styles.icon}>
                        <ArchiveIcon className='w-4 h-4' />
                    </div>
                    <h3>Produkty</h3>
                </div>
                <div className={`${styles.navigation_item} ${activePage == "statistics" && styles.active}`} onClick={() => router.push("/dashboard/statistics")}>
                    <div className={styles.icon}>
                        <PieChartIcon className='w-4 h-4' />
                    </div>
                    <h3>Statystyki</h3>
                </div>
                <Separator className='my-2' />
                <div className={`${styles.navigation_item}`}>
                    <div className={styles.icon}>
                        <HelpCircleIcon className='w-4 h-4' />
                    </div>
                    <h3>Potrzebujesz pomocy?</h3>
                </div>
                <div className={`${styles.navigation_item}`}>
                    <div className={styles.icon}>
                        <LifeBuoyIcon className='w-4 h-4' />
                    </div>
                    <h3>Pytanie 1</h3>
                </div>
            </div>
            <div className={styles.space_h}></div>
            <Button className='w-full'>Jakiś button</Button>
        </div>
    )
}
