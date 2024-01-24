"use client"

import { ShoppingCart } from 'lucide-react';
import styles from './product.module.scss';
import { toast } from '../ui/use-toast';
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/use-cart';
import { Skeleton } from '../ui/skeleton';
import { prepareLink } from '@/lib/utils';
import { useState } from 'react';
import Link from 'next/link';

export const HomeProduct = (
    { 
        id,
        name, 
        image, 
        tax,
        promotion,
        price, 
        newProduct,
        cart,
        link,
        open
    } : { 
        id: string,
        name: string, 
        image: string, 
        tax: number, 
        promotion?: number, 
        price: number, 
        newProduct?: boolean,
        cart?: boolean,
        link?: string,
        open?: boolean
    }
) => {
    const { addItem } = useCart();
    const [isAdding, setIsAdding] = useState(false)
    const router = useRouter()
    const formattedName = name
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
    const linkToHref = `/sklep/produkt/${formattedName}-${id}`

    const cardClick = () => {
        if (cart) {
            if (link) {
                router.push(`/sklep/produkt/${prepareLink(link)}`)
            } else {
                const formattedName = name
                    .replace(/[^a-zA-Z0-9]+/g, " ")
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                router.push(`/sklep/produkt/${formattedName}-${id}`)
            }
        }
    }

    const actionBtnClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        
        // toast({
        //     title: "Dodano do koszyka",
        //     description: `Dodano ${name} do koszyka`,
        // })

        // addCartItem({
        //     id,
        //     name, 
        //     image,
        //     price, 
        //     count: 1, 
        //     promotion: promotion || 0
        // })
        setIsAdding(true)
        await addItem({
            id: parseInt(id),
            size: "uniw",
            quantity: 1
        })
        setIsAdding(false)

        // if (link) {
        //     router.push(`/sklep/produkt/${prepareLink(link)}`)
        // } else {
        //     const formattedName = name
        //         .replace(/[^a-zA-Z0-9]+/g, " ")
        //         .trim()
        //         .toLowerCase()
        //         .replace(/\s+/g, "-");
        //     router.push(`/sklep/produkt/${formattedName}-${id}`)
        // }
    }

    return (
        <Link href={linkToHref} className={styles.card} onClick={cardClick}>
            <img draggable={false} src={image} alt={name} />
            <h1>{name}</h1>
            <h2>
                {promotion ? (
                    <>
                        <span>{price.toFixed(2)}</span> {(price - (price*(promotion/100))).toFixed(2)} zł brutto
                    </>
                ) : (
                    <>
                        {price.toFixed(2)} zł brutto
                    </>
                )}
            </h2>
            <h3>
                {promotion ? (
                    <>
                        <span>{(price-(price*(tax/100))).toFixed(2)}</span> {((price-(price*(promotion/100))) - (price*(tax/100))).toFixed(2)} zł netto
                    </>
                ) : (
                    <>
                        {(price-(price*(tax/100))).toFixed(2)} zł netto
                    </>
                )}
            </h3>
            <button className={`${styles.button}`} onClick={actionBtnClick} disabled={isAdding}>
                {cart ? (
                    <>
                        <ShoppingCart className={styles.icon} size={16} />
                        <p>Do koszyka</p> 
                    </>
                ) : (
                    <p>Kup teraz</p>
                )}
                {/* <ShoppingCart className={styles.icon} size={16} />
                <p>Pokaż</p>  */}
            </button>
            <div className={styles.pills}>
                {promotion && (
                    <div className={`${styles.pill} ${styles.danger}`}>
                        <p>{promotion}%</p>
                    </div>
                )}
                {newProduct && (
                    <div className={`${styles.pill} ${styles.ok}`}>
                        <p>Nowość</p>
                    </div>
                )}
            </div>
        </Link>
    )
}

export const HomeProductSekelet = () => {
    return (
        <div className={styles.card}>
            <Skeleton className="h-[170px] w-[200px]" />
            <h1><Skeleton className="h-5 w-[200px] mb-4" /></h1>
            <h2>
                <Skeleton className="h-4 w-[200px] mb-2" />
            </h2>
            <h3>
                <Skeleton className="h-4 w-[130px]" />
            </h3>
            <Skeleton className="h-[34px] w-[216px]" />
        </div>
    )
}