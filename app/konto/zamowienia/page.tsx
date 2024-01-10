/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect, useRef, useState } from 'react'
import { orderStatuses } from "@/constants/payment"
import { Skeleton } from "@/components/ui/skeleton"
import styles from "@/styles/Account.module.scss"
import { useRouter } from 'next/navigation'
import { v4 } from 'uuid'
import { getOrders } from '@/actions/orders'
import { toast } from '@/components/ui/use-toast'

export default function Orders() {
    const [orders, setOrders] = useState<Order[] | null>(null)
    const router = useRouter()
    const fetchedOrders = useRef(false)

    useEffect(() => {
        async function fetchOrders() {
            await getOrders()
                .then((data) => {
                    if (data.error) {
                        toast({
                            title: "Wystąpił błąd",
                            description: "Podczas pokazywania zamówień wystąpił błąd",
                            variant: "destructive"
                        })
                    } else {
                        fetchedOrders.current = true
                        data.orders && setOrders(data.orders)
                    }
                })
        }

        if (!fetchedOrders.current) {
            fetchOrders()
        }
    }, [])

    return (
        <>
            <div className={styles.header_content}>
                <h1 className={styles.content_title}>Twoje zamówienia</h1>
            </div>

            <div className={styles.orders_body}>
                {!orders ? (
                    <div className={styles.orders_list}>
                        <div className={`${styles.order_item} ${styles.skelet}`}>
                            <div className={styles.left}>
                                <Skeleton className="w-12 h-4 mb-2" />
                                <Skeleton className="w-8 h-3 mb-1" />
                                <Skeleton className="w-8 h-3 mb-2" />
                                <Skeleton className="w-6 h-4" />
                            </div>
                            <div className={styles.products}>
                                <div className={styles.product_icon}>
                                    <Skeleton className="w-[60px] h-[60px] rounded-sm" />
                                </div>
                                <div className={styles.product_icon}>
                                    <Skeleton className="w-[60px] h-[60px] rounded-sm" />
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.order_item} ${styles.skelet}`}>
                            <div className={styles.left}>
                                <Skeleton className="w-12 h-4 mb-2" />
                                <Skeleton className="w-8 h-3 mb-1" />
                                <Skeleton className="w-8 h-3 mb-2" />
                                <Skeleton className="w-6 h-4" />
                            </div>
                            <div className={styles.products}>
                                <div className={styles.product_icon}>
                                    <Skeleton className="w-[60px] h-[60px] rounded-sm" />
                                </div>
                                <div className={styles.product_icon}>
                                    <Skeleton className="w-[60px] h-[60px] rounded-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {orders.length == 0 ? (
                            <div className={styles.empty_order}>
                                <p>Brak zamówień</p>
                            </div>
                        ) : (
                            <div className={styles.orders_list}>
                                {orders.map((order) => (
                                    <div key={v4()} className={styles.order_item} onClick={() => router.push("/konto/zamowienia/"+order.orderNumber)}>
                                        <div className={styles.left}>
                                            <h1 className={styles.order_title}>{orderStatuses[order.status as keyof typeof orderStatuses]}</h1>
                                            <p className={styles.order_date}>{new Intl.DateTimeFormat('pl-PL', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }).format(new Date(order.timestamp))}</p>
                                            <p className={styles.order_number}>#<span>{order.orderNumber}</span></p>
                                            <h1 className={styles.order_price}>{order.worthClientCurrency.formatted}</h1>
                                        </div>
                                        <div className={styles.products}>
                                            {order.products.orderedProducts.length === 1 ? (
                                                <div className={styles.product_icon_title}>
                                                    <div className={styles.product_icon}>
                                                        <img src={`https://elektromaniacy.pl/${order.products.orderedProducts[0].icon}`} alt={order.products.orderedProducts[0].name} />
                                                    </div>
                                                    <h1>{order.products.orderedProducts[0].name}</h1>
                                                </div>
                                                
                                            ) : (
                                                <>
                                                    {order.products.orderedProducts.map((product) => {
                                                        return (
                                                            <div key={product.name} className={styles.product_icon}>
                                                                <img src={`https://elektromaniacy.pl/${product.icon}`} alt={product.name} />
                                                            </div>  
                                                        )
                                                    })}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div> 
        </>
    )
}
