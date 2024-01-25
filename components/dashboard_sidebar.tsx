"use client"

import React, { useEffect } from 'react'
import { usePathname, useRouter } from "next/navigation"
import { ArchiveIcon, HelpCircleIcon, TruckIcon, LifeBuoyIcon, HomeIcon, BoxIcon, PieChartIcon, User2Icon } from 'lucide-react'
import bg from "@/assets/account/bg.jpg"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import styles from "@/styles/Account.module.scss"
import { Skeleton } from './ui/skeleton'
import { useCurrentUser } from '@/hooks/use-current-user'
import Link from 'next/link'

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
                <Link href="/dashboard" className={`${styles.navigation_item} ${activePage == "dashboard" && styles.active}`}>
                    <div className={styles.icon}>
                        <HomeIcon className='w-4 h-4' />
                    </div>
                    <h3>Strona główna</h3>
                </Link>
                <Link href="/dashboard/orders" className={`${styles.navigation_item} ${activePage == "orders" && styles.active}`}>
                    <div className={styles.icon}>
                        <BoxIcon className='w-4 h-4' />
                    </div>
                    <h3>Zamówienia</h3>
                </Link>
                <Link href="/dashboard/users" className={`${styles.navigation_item} ${activePage == "users" && styles.active}`}>
                    <div className={styles.icon}>
                        <User2Icon className='w-4 h-4' />
                    </div>
                    <h3>Użytkownicy</h3>
                </Link>
                <Link href="/dashboard/shipments" className={`${styles.navigation_item} ${activePage == "shipments" && styles.active}`}>
                    <div className={styles.icon}>
                        <TruckIcon className='w-4 h-4' />
                    </div>
                    <h3>Opcje dostawy</h3>
                </Link>
                <Link href="/dashboard/products" className={`${styles.navigation_item} ${activePage == "products" && styles.active}`}>
                    <div className={styles.icon}>
                        <ArchiveIcon className='w-4 h-4' />
                    </div>
                    <h3>Produkty</h3>
                </Link>
                <Link href="/dashboard/statistics" className={`${styles.navigation_item} ${activePage == "statistics" && styles.active}`}>
                    <div className={styles.icon}>
                        <PieChartIcon className='w-4 h-4' />
                    </div>
                    <h3>Statystyki</h3>
                </Link>
            </div>
            <div className={styles.space_h}></div>
            <Button className='w-full'>Jakiś button</Button>
        </div>
    )
}
