/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { prepareLink } from '@/lib/utils'
import { orderStatuses, przelewy24PaymentStatuses } from '@/constants/payment'
import { getOrderByOrderIdAsAdmin } from '@/actions/orders'
import Link from 'next/link'
import SidebarOrderManageComponent from '@/components/dashboard/orders/sidebar-manage'

export default async function OrderDetailsPage({ params }: { params: { orderId: string } }) {
    const orderDataResponse = await getOrderByOrderIdAsAdmin(params.orderId)
    if (!orderDataResponse || orderDataResponse.error || orderDataResponse.order === undefined) return <h1>{orderDataResponse.error}</h1>
    const order = orderDataResponse.order

    return (
        <div className='pl-3 flex h-[60rem] w-full gap-1'>
            <Card className="grow h-full">
                <CardHeader>
                    <CardTitle>Informacje</CardTitle>
                    <CardDescription>Poniżej znajdziesz wszystkie informacje o zamówieniu.</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-2 h-[48rem] overflow-y-auto'>
                    <div className='flex flex-col rounded-lg border p-3 shadow-sm w-full'>
                        <h1 className='text-lg font-semibold mb-2'>Informacje o zamówieniu</h1>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Data złożenia</p>
                            <h1 className='min-w-max text-md font-semibold'>{new Intl.DateTimeFormat('pl-PL', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric',
                                                                            }).format(new Date(order.timestamp))}</h1>
                        </div>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Numer zamówienia</p>
                            <h1 className='min-w-max text-md font-semibold'>{order.orderNumber}</h1>
                        </div>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Status płatności</p>
                            <h1 className='min-w-max text-md font-semibold'>{przelewy24PaymentStatuses[order.payment.status as keyof typeof przelewy24PaymentStatuses]}</h1>
                        </div>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Status zamówienia</p>
                            <h1 className='min-w-max text-md font-semibold'>{orderStatuses[order.status as keyof typeof orderStatuses]}</h1>
                        </div>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Typ płatności</p>
                            <h1 className='min-w-max text-md font-semibold'>{order.payment.paymentMethod.id !== "dvp" ? "Płatność internetowa" : "Za pobraniem"}</h1>
                        </div>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Kwota zamówienia</p>
                            <h1 className='min-w-max text-md font-semibold'>{order.worthClientCurrency.formatted}</h1>
                        </div>
                    </div>
                    <div className='flex flex-col rounded-lg border p-3 shadow-sm w-full'>
                        <h1 className='text-lg font-semibold mb-2'>Dane o kupującym</h1>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Imię i nazwisko</p>
                            <h1 className='min-w-max text-md font-semibold'>{order.client.billingData.firstname} {order.client.billingData.lastname}</h1>
                        </div>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Adres email</p>
                            <h1 className='min-w-max text-md font-semibold'>{order.client.email}</h1>
                        </div>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Numer telefonu</p>
                            <h1 className='min-w-max text-md font-semibold'>{order.client.phone}</h1>
                        </div>
                    </div>
                    <div className='flex flex-col rounded-lg border p-3 shadow-sm w-full'>
                        <h1 className='text-lg font-semibold mb-2'>Dane do wysyłki</h1>
                        <div className='flex items-center mb-1'>
                            <p className='w-full text-md font-normal'>Typ adresu</p>
                            <h1 className='min-w-max text-md font-semibold'>{order.shipping.pickupData ? order.shipping.pickupData.name : "Adres domowy"}</h1>
                        </div>
                        {order.shipping.pickupData ? (
                            <>
                                <div className='flex items-center mb-1'>
                                    <p className='w-full text-md font-normal'>Ulica</p>
                                    <h1 className='min-w-max text-md font-semibold'>{order.shipping.pickupData.address.street}</h1>
                                </div>
                                <div className='flex items-center mb-1'>
                                    <p className='w-full text-md font-normal'>Miasto</p>
                                    <h1 className='min-w-max text-md font-semibold'>{order.shipping.pickupData.address.zipcode} - {order.shipping.pickupData.address.city}</h1>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex items-center mb-1'>
                                    <p className='w-full text-md font-normal'>Imię i nazwisko</p>
                                    <h1 className='min-w-max text-md font-semibold'>{order.client.deliveryData.firstname} {order.client.deliveryData.lastname}</h1>
                                </div>
                                <div className='flex items-center mb-1'>
                                    <p className='w-full text-md font-normal'>Adres</p>
                                    <h1 className='min-w-max text-md font-semibold'>{order.client.deliveryData.street} - {order.client.deliveryData.zipcode} {order.client.deliveryData.city} - {order.client.deliveryData.countryName}</h1>
                                </div>
                                <div className='flex items-center mb-1'>
                                    <p className='w-full text-md font-normal'>Opcje kontaktu</p>
                                    <h1 className='min-w-max text-md font-semibold'>{order.client.email} / {order.client.phone}</h1>
                                </div>
                            </>
                        )}
                    </div>
                    <div className='flex flex-col rounded-lg border p-3 shadow-sm w-full'>
                        <h1 className='text-lg font-semibold mb-2'>Kupione produkty</h1>
                        {order.products.orderedProducts.map((product) => {
                            return (
                                <div key={product.name} className="flex items-center">
                                    <Link href={`/sklep/produkt/${prepareLink(product.link)}`} className="flex items-center justify-center w-[60px] h-[60px] rounded-md">
                                        <img src={`https://elektromaniacy.pl/${product.icon}`} className='w-[60px] h-[60px] rounded-md object-contain' alt={product.name} />
                                    </Link>
                                    <Link href={`/sklep/produkt/${prepareLink(product.link)}`} className="">
                                        <h1 className=" text-md font-semibold ml-2">{product.name}</h1>
                                    </Link>
                                    <div className="min-w-max">
                                        <p className="text-sm font-medium">{product.quantity} szt.</p>
                                        <p className="text-sm font-medium">{product.price.price.gross.formatted}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
            <Card className="flex-none">
                <CardHeader className='py-[3rem] px-[1.5rem]'>
                    <CardTitle>Zarządzaj</CardTitle>
                    <CardDescription>Zarządzaj zamówieniem w prosty sposób.</CardDescription>
                </CardHeader>
                <CardContent className='py-[1rem] px-[1.5rem]'>
                    <SidebarOrderManageComponent orderId={order.orderId} defaultOrderStatus={order.status} />
                </CardContent>
            </Card>
        </div>
    )
}
