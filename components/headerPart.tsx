"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { v4 } from "uuid";
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart'
import styles from '../styles/Layout.module.scss';
import logo from '@/public/4lop.svg';
import { ClockIcon, LogIn, LogOutIcon, MenuIcon, Search, ShoppingCartIcon, User2Icon, XIcon } from 'lucide-react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { LogoutButton } from './auth/logout-button'
import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'

export default function HeaderPart() {
    const pathname = usePathname();
    const role = useCurrentRole();
    const router = useRouter()
    const [mobileMenuOpened, setMobileMenuOpened] = React.useState(false)
    const user = useCurrentUser()
    const { loading: cartLoading, cart  } = useCart();

    const navigation = [
        {
            name: "Strona główna",
            link: "/"
        },
        {
            name: "Nasze stoły",
            link: "/sklep"
        },
        {
            name: "O nas",
            link: "/onas"
        },
        {
            name: "Konfigurator",
            link: "/konfigurator"
        },
        {
            name: "Blog",
            link: "/blog"
        }
    ]

    return (
        <>
            {pathname !== "/studio" && (
                <header>
                    <div className={styles.inner_header}>
                        <Link href="/"><Image draggable={false} src={logo} alt="" className={styles.logo} /></Link>
                        <div className={styles.buttons}>
                            {navigation.map(item => (
                                <Link key={v4()} href={item.link} className={`${styles.button} ${pathname === item.link ? styles.active : ""}`}>
                                    {item.name}
                                    <span className={styles.bg}></span>
                                    {/* {location.pathname === item.link && (
                                        <motion.span className={styles.underline} layoutId="underline_nav"></motion.span>
                                    )} */}
                                </Link>
                            ))}
                            {role === UserRole.ADMIN && (
                                <Link href="/dashboard">
                                    <div className={`${styles.button} ${pathname === "/dashboard" ? styles.active : ""}`}>
                                        Panel administratora
                                        <span className={styles.bg}></span>
                                    </div>
                                </Link>
                            )}
                        </div>
                        <div className={styles.icons_buttons}>
                            <Link href="/sklep" className={styles.icon}><Search size={22}/></Link>

                            <div 
                                className={`${styles.icon} ${pathname === '/koszyk' ? styles.active : ""}`} 
                                onClick={() => router.push('/koszyk')}
                            >
                                <ShoppingCartIcon size={22}/>
                                <span className={styles.items_number}>
                                    {cartLoading ? (
                                        <ClockIcon size={10} />
                                    ) : (
                                        <>
                                            {cart?.products.reduce((total, item) => {
                                                if (item.quantity === -1) return total
                                                return total + item.quantity
                                            }, 0)}
                                        </>
                                    )}
                                </span>
                            </div>
                            {user !== undefined ? (
                                // <div 
                                //     className={`${styles.icon} ${pathname === '/konto' ? styles.active : ""}`} 
                                //     onClick={() => router.push('/konto')}
                                // >
                                //     <User2Icon size={22} />
                                // </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="focus:outline-none">
                                        <div className={`${styles.icon} ${pathname === '/konto' ? styles.active : ""}`} >
                                            <User2Icon size={22} />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-40" align="end">
                                            <Link href="/konto">
                                                <DropdownMenuItem>
                                                    <p className="flex items-center">
                                                        <User2Icon className="w-4 h-4 mr-2" /> Twoje konto
                                                    </p>
                                                </DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem>
                                                <LogoutButton>
                                                    <div className='flex items-center'>
                                                        <LogOutIcon className="w-4 h-4 mr-2" /> Wyloguj się
                                                    </div>
                                                </LogoutButton>
                                            </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <div 
                                    className={`${styles.icon} ${pathname === '/auth/login' ? styles.active : ""}`} 
                                    onClick={() => router.push('/auth/login')}
                                >
                                    <LogIn size={22} />
                                </div>
                            )}
                        </div>
                        <div className={styles.mobile_menu} onClick={() => setMobileMenuOpened(prev => !prev)}>
                            {mobileMenuOpened ? <XIcon size={22} /> : <MenuIcon size={22} /> }
                        </div>
                    </div>
                    {mobileMenuOpened && (
                        <div className={styles.mobile_menu_layout}>
                            <div className={styles.mobile_buttons}>
                                {navigation.map(item => (
                                    <Link key={v4()} href={item.link} className={`${styles.button} ${pathname === item.link ? styles.active : ""}`} onClick={() => setMobileMenuOpened(false)}>
                                        {item.name}
                                        <span className={styles.bg}></span>
                                        {/* {location.pathname === item.link && (
                                            <motion.span className={styles.underline} layoutId="underline_nav"></motion.span>
                                        )} */}
                                    </Link>
                                ))}
                                {role === UserRole.ADMIN && (
                                    <Link href="/dashboard">
                                        <div className={`${styles.button} ${pathname === "/dashboard" ? styles.active : ""}`}>
                                            Panel administratora
                                            <span className={styles.bg}></span>
                                        </div>
                                    </Link>
                                )}
                            </div>
                            <div className={styles.mobile_icons_buttons}>
                                <Link href="/sklep" className={styles.icon}><Search size={22}/></Link>

                                <div 
                                    className={`${styles.icon} ${pathname === '/koszyk' ? styles.active : ""}`} 
                                    onClick={() => {router.push('/koszyk'); setMobileMenuOpened(false)}}
                                >
                                    <ShoppingCartIcon size={22}/>
                                    <span className={styles.items_number}>
                                        {cartLoading ? (
                                            <ClockIcon size={10} />
                                        ) : (
                                            <>
                                                {cart?.products.reduce((total, item) => {
                                                    if (item.quantity === -1) return total
                                                    return total + item.quantity
                                                }, 0)}
                                            </>
                                        )}
                                    </span>
                                </div>

                                {user !== undefined ? (
                                    <div 
                                        className={`${styles.icon} ${pathname === '/konto' ? styles.active : ""}`} 
                                        onClick={() => {router.push('/konto'); setMobileMenuOpened(false)}}
                                    >
                                        <User2Icon size={22} />
                                    </div>
                                ) : (
                                    <div 
                                        className={`${styles.icon} ${pathname === '/auth/login' ? styles.active : ""}`} 
                                        onClick={() => {router.push('/auth/login'); setMobileMenuOpened(false)}}
                                    >
                                        <LogIn size={22} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>
            )}
        </>
        
    )
}