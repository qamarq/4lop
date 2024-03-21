"use client"

import React, { useEffect } from 'react'
import { usePathname } from "next/navigation"
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'
import Link from 'next/link'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { cn } from '@/lib/utils'
import { Skeleton } from './ui/skeleton'

export default function DashboardSidebar() {
    const pathname = usePathname()
    const user = useCurrentUser()
    const [activePage, setActivePage] = React.useState<string>("")
   
    useEffect(() => {
        if (!pathname) return
        setActivePage(pathname.slice(1).split('/').pop() || "")
    }, [pathname])
    
    return (
        // <div className={styles.navigation}>
        //     <div className={styles.header} style={{backgroundImage: `url(${bg.src})`}}>
        //         <p>Dashboard</p>
        //         <h1>{user ? `${user.firstname} ${user.lastname}` : <Skeleton className='h-4 w-20 mt-2' />}</h1>
        //     </div>
        //     <Separator className='my-4' />
        //     <div className={styles.navigation_items}>
        //         <Link href="/dashboard" className={`${styles.navigation_item} ${activePage == "dashboard" && styles.active}`}>
        //             <div className={styles.icon}>
        //                 <HomeIcon className='w-4 h-4' />
        //             </div>
        //             <h3>Strona główna</h3>
        //         </Link>
        //         <Link href="/dashboard/orders" className={`${styles.navigation_item} ${activePage == "orders" && styles.active}`}>
        //             <div className={styles.icon}>
        //                 <BoxIcon className='w-4 h-4' />
        //             </div>
        //             <h3>Zamówienia</h3>
        //         </Link>
        //         <Link href="/dashboard/users" className={`${styles.navigation_item} ${activePage == "users" && styles.active}`}>
        //             <div className={styles.icon}>
        //                 <User2Icon className='w-4 h-4' />
        //             </div>
        //             <h3>Użytkownicy</h3>
        //         </Link>
        //         <Link href="/dashboard/shipments" className={`${styles.navigation_item} ${activePage == "shipments" && styles.active}`}>
        //             <div className={styles.icon}>
        //                 <TruckIcon className='w-4 h-4' />
        //             </div>
        //             <h3>Opcje dostawy</h3>
        //         </Link>
        //         <Link href="/dashboard/products" className={`${styles.navigation_item} ${activePage == "products" && styles.active}`}>
        //             <div className={styles.icon}>
        //                 <ArchiveIcon className='w-4 h-4' />
        //             </div>
        //             <h3>Produkty</h3>
        //         </Link>
        //         <Link href="/dashboard/editing" className={`${styles.navigation_item} ${activePage == "editing" && styles.active}`}>
        //             <div className={styles.icon}>
        //                 <PencilIcon className='w-4 h-4' />
        //             </div>
        //             <h3>Edycja strony</h3>
        //         </Link>
        //     </div>
        //     {/* <div className={styles.space_h}></div>
        //     <Button className='w-full'>Jakiś button</Button> */}
        // </div>
        <div className="border-b p-2">
            <div className="flex h-16 items-center px-4">
                <nav
                    className={
                        'flex items-center space-x-4 lg:space-x-6'
                    }
                >
                    <Link href="/">
                        <Button variant="outline" size="icon" className='mr-2'>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link
                        href="/dashboard"
                        className={cn("text-sm font-medium transition-colors hover:text-primary", {"text-muted-foreground": activePage !== "dashboard" })}>
                        Strona główna
                    </Link>
                    <Link
                        href="/dashboard/orders"
                        className={cn("text-sm font-medium transition-colors hover:text-primary", {"text-muted-foreground": activePage !== "orders" })}>
                        Zamówienia
                    </Link>
                    <Link
                        href="/dashboard/users"
                        className={cn("text-sm font-medium transition-colors hover:text-primary", {"text-muted-foreground": activePage !== "users" })}>
                        Użytkownicy
                    </Link>
                    <Link
                        href="/dashboard/shipments"
                        className={cn("text-sm font-medium transition-colors hover:text-primary", {"text-muted-foreground": activePage !== "shipments" })}>
                        Opcje dostawy
                    </Link>
                    <Link
                        href="/dashboard/products"
                        className={cn("text-sm font-medium transition-colors hover:text-primary", {"text-muted-foreground": activePage !== "products" })}>
                        Produkty
                    </Link>
                    <Link
                        href="/dashboard/editing"
                        className={cn("text-sm font-medium transition-colors hover:text-primary", {"text-muted-foreground": activePage !== "editing" })}>
                        Edycja strony
                    </Link>
                </nav>
                <div className="ml-auto flex items-center space-x-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src="/avatars/01.png"
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>{user && `${user.firstname.slice(0, 1)}${user.lastname.slice(0, 1)}`}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[230px]"
                            align="end"
                            forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user ? user.name : <Skeleton className='h-4 w-20 mt-2' />}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user ? user.email : <Skeleton className='h-4 w-20 mt-2' />}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Profile
                                    <DropdownMenuShortcut>
                                        ⇧⌘P
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Billing
                                    <DropdownMenuShortcut>
                                        ⌘B
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings
                                    <DropdownMenuShortcut>
                                        ⌘S
                                    </DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    New Team
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                Log out
                                <DropdownMenuShortcut>
                                    ⇧⌘Q
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}
