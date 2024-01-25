/* eslint-disable @next/next/no-img-element */
"use client"

import { toast } from '@/components/ui/use-toast'
import styles from "@/styles/Account.module.scss"
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeftIcon, Loader2Icon, MapPinIcon } from 'lucide-react'
import Link from 'next/link'
import { prepareLink } from '@/lib/utils'
import { orderStatuses, paymentStatuses, przelewy24PaymentStatuses } from '@/constants/payment'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'
import { getOrderByOrderNumber } from '@/actions/orders'
import { getRefreshPayment } from '@/actions/payment'

export default function OrderDetails() {
    const [loadingOrders, setLoadingOrders] = useState(false)
    const [loadingPayment, setLoadingPayment] = useState(false)
    const [paymentData, setPaymentData] = useState<PaymentForm | null>(null);
    const user = useCurrentUser()
    const [order, setOrder] = useState<Order | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const orderNumber = pathname.slice(1).split('/').pop()
    const formRef = useRef<HTMLFormElement>(null);
    const fetchedOrder = useRef(false)

    useEffect(() => {
        if (paymentData) {
            if (formRef.current) {
                formRef.current.submit();
            }
        }
    }, [paymentData]);

    async function getPayment() {
        setLoadingPayment(true)
        if (!order || !user) return

        await getRefreshPayment(orderNumber || "0")
            .then((data) => {
                if (data.success) {
                    setLoadingPayment(false);
                    window.location.href = data.paymentLink
                }
            })
    }

    useEffect(() => {
        async function getOrders() {
            if (!user) return
            setLoadingOrders(true)
            await getOrderByOrderNumber(orderNumber || "")
                .then((data) => {
                    if (data.error) {
                        toast({
                            title: "Wystąpił błąd",
                            description: "Podczas pokazywania zamówień wystąpił błąd",
                            variant: "destructive"
                        })
                    } else {
                        fetchedOrder.current = true
                        data.order && setOrder(data.order)
                    }
                })
        }

        if (user) {
            if (!fetchedOrder.current) {
                getOrders()
            }
        }
    }, [user])

    return (
        <>
            {order ? (
                <>
                    <div className={styles.order_header}>
                        <div className={styles.go_back} onClick={() => router.push("/konto/zamowienia")}>
                            <ChevronLeftIcon className='h-4 w-4 mr-2' />
                            <p>Pokaż wszystkie zamówienia</p>
                        </div>
                    </div>
                    <div className={styles.order_container}>
                        <div className={styles.subheader}>
                            <h1 className={styles.order_title}>Zamówienie nr <span>{order.orderNumber}</span> - {orderStatuses[order.status as keyof typeof orderStatuses]}</h1>
                            <h2 className={styles.order_subtitle}>złożone {new Intl.DateTimeFormat('pl-PL', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                }).format(new Date(order.timestamp))} roku</h2>
                        </div>
            
                        <div className={styles.order_item}>
                            <h1 className={styles.order_item_title}>Dostawa</h1>
            
                            <div className={`${styles.order_item_body} ${styles.horizontal}`}>
                                <img className={styles.item_body_img} src={order.shipping.courier.icon} alt="" />
                                <p className={styles.item_body_text}>{order.shipping.courier.name}</p>
                            </div>
                        </div>

                        {order.shipping.courier.pickupPoint && (
                            <div className={styles.order_item}>
                                <h1 className={styles.order_item_title}>Wybrany paczkomat</h1>
                
                                <div className={styles.order_item_body}>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <div className='w-[100px] h-[100px]'>
                                                <img src={order.shipping.pickupData.markerIconUrl} alt="" className='rounded-md object-cover w-full h-full' />
                                            </div>
                                            <div className='flex flex-col ml-2'>
                                                <h1 className='text-lg mb-2 font-semibold'>{order.shipping.pickupData.name}</h1>
                                                <p className='mt-1 font-normal'>Opis: <span className='font-semibold'>{order.shipping.pickupData.location}</span></p>
                                                <p className='mt-1 font-normal'>Adres: <span className='font-semibold'>{order.shipping.pickupData.address.street}, {order.shipping.pickupData.address.zipcode} - {order.shipping.pickupData.address.city}</span></p>
                                            </div>
                                        </div>
                                        <Button asChild>
                                            <Link target='_blank' href={`https://www.google.com/maps/search/?api=1&query=${order.shipping.pickupData.coordinates.latitude},${order.shipping.pickupData.coordinates.longitude}`}>
                                                <MapPinIcon className='w-4 h-4 mr-2' />
                                                Zobacz na mapie
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
            
                        <div className={styles.order_item}>
                            <h1 className={styles.order_item_title}>Płatność</h1>
            
                            <div className={`${styles.order_item_body} ${styles.horizontal}`}>
                                <img className={styles.item_body_img} src={order.payment.paymentMethod.icon} alt="" />
                                <p className={styles.item_body_text}>
                                    {order.payment.paymentMethod.name}
                                    {order.payment.status == "n" && (
                                        <span> - wystąpił błąd</span>
                                    )}
                                    {" "}- {przelewy24PaymentStatuses[order.payment.status as string]}
                                </p>
                            
                                {order.payment.status == "0" && (
                                    <Button onClick={getPayment} className='ml-4' disabled={loadingPayment}>
                                        {loadingPayment ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : null}
                                        Zapłać {order.worthClientCurrency.formatted} (spróbuj ponownie)
                                    </Button>
                                )}
                            </div>
                        </div>
            
                        <div className={styles.order_item_address}>
                            <div className={styles.order_item}>
                                <h1 className={styles.order_item_title}>Adres odbioru</h1>
            
                                <div className={styles.order_item_body}>
                                    {order.shipping.pickupData ? (
                                        <>
                                            <h1 className={styles.name}>{order.shipping.pickupData.name}</h1>
            
                                            <p className={styles.subname}>Ulica: {order.shipping.pickupData.address.street}</p>
                                            <p className={styles.subname}>Miasto: {order.shipping.pickupData.address.zipcode} {order.shipping.pickupData.address.city}</p>
                                        </>
                                    ) : (
                                        <>
                                            <h1 className={styles.name}>{order.client.deliveryData.firstname} {order.client.deliveryData.lastname}</h1>
            
                                            <p className={styles.subname}>{order.client.deliveryData.street}</p>
                                            <p className={styles.subname}>{order.client.deliveryData.zipcode} {order.client.deliveryData.city} - {order.client.deliveryData.countryName}</p>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className={styles.order_item}>
                                <h1 className={styles.order_item_title}>Dane odbiorcy</h1>
            
                                <div className={styles.order_item_body}>
                                    <h1 className={styles.name}>{order.client.deliveryData.firstname} {order.client.deliveryData.lastname}</h1>
            
                                    {/* <p className={styles.subname}>{order.client.deliveryData.street}</p>
                                    <p className={styles.subname}>{order.client.deliveryData.zipcode} {order.client.deliveryData.city} - {order.client.deliveryData.countryName}</p> */}
                                    <p>Telefon: {order.client.phone}</p>
                                    <p>E-mail: {order.client.email}</p>
                                </div>
                            </div>
                        </div>
            
                        <div className={styles.order_item}>
                            <h1 className={styles.order_item_title}>Dane do faktury</h1>
            
                            <div className={styles.order_item_body}>
                                <h1 className={styles.name}>{order.client.billingData.firstname} {order.client.billingData.lastname}</h1>
            
                                <p className={styles.subname}>{order.client.billingData.street}</p>
                                <p className={styles.subname}>{order.client.billingData.zipcode} {order.client.billingData.city}</p>
                                {order.client.billingData.taxNumber && (
                                    <p className={styles.subname}>NIP: {order.client.billingData.taxNumber}</p>
                                )}
                            </div>
                        </div>
            
                        <div className={styles.order_item}>
                            <h1 className={styles.order_item_title}>Zamówienie</h1>
            
                            <div className={styles.order_item_products}>
                                {order.products.orderedProducts.map((product) => {
                                    return (
                                        <div key={product.name} className={styles.product}>
                                            <Link href={`/sklep/produkt/${prepareLink(product.link)}`} className={styles.product_icon}>
                                                <img src={`https://elektromaniacy.pl/${product.icon}`} alt={product.name} />
                                            </Link>
                                            <Link href={`/sklep/produkt/${prepareLink(product.link)}`} className={styles.product_info}>
                                                <h1 className={styles.product_name}>{product.name}</h1>
                                            </Link>
                                            <div className={styles.product_details}>
                                                <p className={styles.product_quantity}>{product.quantity} szt.</p>
                                                <p className={styles.product_price}>{product.price.price.gross.formatted}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div className={styles.products_summary}>
                                    <div className={styles.inner}>
                                        <div className={styles.item}>
                                            <p>Wartość produktów:</p>
                                            <h1>{order.products.worthClientCurrency.formatted}</h1>
                                        </div>
                                        <div className={styles.item}>
                                            <p>Koszt dostawy:</p>
                                            <h1>{order.shipping.costClientCurrency.formatted}</h1>
                                        </div>
                                        <hr />
                                        <div className={styles.item_total}>
                                            <p>Wartość koszyka</p>
                                            <h1>{order.worthClientCurrency.formatted}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {paymentData && (
                        <form
                            ref={formRef}
                            id="paymentForm"
                            action={paymentData.action}
                            method={paymentData.method}
                        >
                            {paymentData.inputs.map((input, index) => (
                                <input
                                    key={index}
                                    type={input.type}
                                    name={input.name}
                                    value={input.value}
                                    className={input.className || ""}
                                />
                            ))}
                        </form>
                    )}
                </>
            ) : (
                <div>loading</div>
            )}
        </>
    )
}
