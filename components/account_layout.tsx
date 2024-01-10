"use client"

import React, { useEffect } from 'react'
import { usePathname, useRouter } from "next/navigation"
import { ArchiveIcon, HelpCircleIcon, KeyRoundIcon, LifeBuoyIcon, UserIcon } from 'lucide-react'
import bg from "@/assets/account/bg.jpg"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import styles from "@/styles/Account.module.scss"
import { Skeleton } from './ui/skeleton'
import { useCurrentUser } from '@/hooks/use-current-user'
import { LogoutButton } from './auth/logout-button'

export default function AccountLayout() {
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
                <p>Witaj</p>
                <h1>{user ? `${user.firstname} ${user.lastname}` : <Skeleton className='h-4 w-20 mt-2' />}</h1>
            </div>
            <Separator className='my-4' />
            <div className={styles.navigation_items}>
                <div className={`${styles.navigation_item} ${activePage == "konto" && styles.active}`} onClick={() => router.push("/konto")}>
                    <div className={styles.icon}>
                        <UserIcon className='w-4 h-4' />
                    </div>
                    <h3>Twoje konto</h3>
                </div>
                <div className={`${styles.navigation_item} ${activePage == "zamowienia" && styles.active}`} onClick={() => router.push("/konto/zamowienia")}>
                    <div className={styles.icon}>
                        <ArchiveIcon className='w-4 h-4' />
                    </div>
                    <h3>Zamówienia</h3>
                </div>
                <div className={`${styles.navigation_item} ${activePage == "zabezpieczenia" && styles.active}`} onClick={() => router.push("/konto/zabezpieczenia")}>
                    <div className={styles.icon}>
                        <KeyRoundIcon className='w-4 h-4' />
                    </div>
                    <h3>Zabezpieczenia</h3>
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
                    <h3>Jak zrobić zwrot</h3>
                </div>
            </div>
            <div className={styles.space_h}></div>
            <LogoutButton>
                <Button className='w-full'>Wyloguj się</Button>
            </LogoutButton>
        </div>
    )
}
