/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect, useState, useTransition } from 'react'
import styles from "@/styles/Summary.module.scss"
import { ChevronRight, Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { SAVED_ORDER_SETTINGS_NAME } from '@/constants'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useCurrentUser } from '@/hooks/use-current-user'
import { createOrder } from '@/actions/orders'
import { purchaseDocumentType } from '@prisma/client'

export default function SummaryPage() {
    const user = useCurrentUser()
    const { cart } = useCart()
    const router = useRouter()
    const [receiptType, setReceiptType] = useState<string | undefined>(undefined)
    const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false)
    const [acceptedRights, setAcceptedRights] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()
    const [orderOptions, setOrderOptions] = useState<OrderOptions | null>(null)
    const [orderNotes, setOrderNotes] = useState<string>("")
    const [deliveryNotes, setDeliveryNotes] = useState<string>("")

    useEffect(() => {
        const options = localStorage.getItem(SAVED_ORDER_SETTINGS_NAME) || "{}"
        const parsed = JSON.parse(options) as OrderOptions
        setOrderOptions(parsed)
    }, [])

    async function next(): Promise<void> {
        if (!cart || !user || !orderOptions || !receiptType) return

        startTransition(() => {
            createOrder({
                deliveryRemarks: deliveryNotes,
                remarks: orderNotes,
                paymentMethodId: orderOptions.payment,
                courierId: orderOptions?.delivery.courierId,
                pickupPointData: orderOptions?.selectedPickupPoint,
                prepaid: orderOptions?.shippingMode,
                purchaseDocumentType: receiptType,
            })
                .then((data) => {
                    if (data.success) {
                        localStorage.removeItem(SAVED_ORDER_SETTINGS_NAME)
                        if (orderOptions.payment === "dvp") {
                            router.push(`/konto/zamowienia/${data.order.orderNumber}`)
                        } else {
                            // router.push(`/koszyk/platnosc?orderId=${data.order.orderId}&orderNumber=${data.order.orderNumber}&paymentId=${data.payment ? data.payment.paymentId : 0}&paymentSecret=${data.payment ? data.payment.paymentSecret : 0}`)
                            window.location.href = data.payment?.link || `/konto/zamowienia/${data.order.orderNumber}`
                        }
                    } else {
                        toast({
                            title: "Wystąpił błąd",
                            description: data.error,
                            variant: "destructive"
                        })
                    }
                })
        })

        // const response = await fetch('/api/shop/order/create', {
        //     method: 'POST',
        //     body: JSON.stringify({ 
        //         userId: user.id,
        //         firstname: user.firstname,
        //         lastname: user.lastname,
        //         street: user.street,
        //         email: user.email,
        //         zipcode: user.zipCode,
        //         city: user.city,
        //         country: "PL",
        //         phone: user.phone,
        //         type: user.accountType,
        //         deliveryRemarks: deliveryNotes,
        //         remarks: orderNotes,
        //         paymentMethodId: orderOptions?.payment,
        //         selectedGroup: orderOptions?.payment,
        //         courierId: orderOptions?.delivery.courierId,
        //         pickupPointId: orderOptions?.selectedPickupPoint,
        //         prepaid: orderOptions?.shippingMode,
        //         purchaseDocumentType: receiptType,
        //      }),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });

        // if (response.ok) {
        //     const responseData = await response.json()
        //     if (responseData.order) {
        //         router.push(`/koszyk/platnosc?orderId=${responseData.order.orderId}&orderNumber=${responseData.order.orderNumber}&paymentId=${responseData.payment.paymentId}`)
        //     } else {
        //         toast({
        //             title: "Wystąpił błąd",
        //             description: responseData.message,
        //             variant: "destructive"
        //         })
        //     }
        //     setLoading(false);
        // } else {
        //     setLoading(false);
        //     toast({
        //         title: "Wystąpił błąd",
        //         description: "Podczas składania zamówienia wystąpił błąd",
        //         variant: "destructive"
        //     })
        // }
    }

    return (
        <>
            <div className={styles.container4lop}>
                <h4 className={styles.navigation_label}>
                    Strona główna 
                    <ChevronRight size={18} style={{marginInline: 6}} /> 
                    Koszyk
                    <ChevronRight size={18} style={{marginInline: 6}} /> 
                    Podsumowanie
                </h4>
                <div className={styles.title}>
                    <h1>Sprawdź poprawność danych</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.data_toverify}>
                    <div className={styles.data}>
                        <h1>Dane zamawiającego</h1>
                        <div className={styles.data_item}>
                            <h3>Imię i nazwisko:</h3>
                            <p>{user?.firstname} {user?.lastname}</p>
                        </div>
                        <div className={styles.data_item}>
                            <h3>Adres e-mail:</h3>
                            <p>{user?.email}</p>
                        </div>
                        <div className={styles.data_item}>
                            <h3>Numer telefonu:</h3>
                            <p>{user?.phone}</p>
                        </div>
                    </div>
                    <div className={styles.data}>
                        <h1>Adres dostawy</h1>
                        <div className={styles.data_item}>
                            <h3>Ulica:</h3>
                            <p>{user?.street}</p>
                        </div>
                        <div className={styles.data_item}>
                            <h3>Kod pocztowy:</h3>
                            <p>{user?.zipCode}</p>
                        </div>
                        <div className={styles.data_item}>
                            <h3>Miasto:</h3>
                            <p>{user?.city}</p>
                        </div>
                    </div>
                    <div className={styles.data}>
                        <h1>Dane odbiorcy</h1>
                        <div className={styles.data_item}>
                            <h3>Imię i nazwisko:</h3>
                            <p>{user?.firstname} {user?.lastname}</p>
                        </div>
                        <div className={styles.data_item}>
                            <h3>Adres e-mail:</h3>
                            <p>{user?.email}</p>
                        </div>
                        <div className={styles.data_item}>
                            <h3>Numer telefonu:</h3>
                            <p>{user?.phone}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.receipt_type}>
                    <h1>Chcę otrzymać:</h1>
                    {/* <div className="flex items-center space-x-2">
                        <Checkbox required id="paragon" name='paragon' />
                        <label
                            htmlFor="paragon"
                            className="text-sm font-small leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >Paragon</label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox required id="faktura_ele" name='faktura_ele' />
                        <label
                            htmlFor="faktura_ele"
                            className="text-sm font-small leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >Faktura w formie elektronicznej</label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox required id="faktura" name='faktura' />
                        <label
                            htmlFor="faktura"
                            className="text-sm font-small leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >Faktura w formie papierowej</label>
                    </div> */}
                    <RadioGroup className={styles.radio_group} onValueChange={setReceiptType}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={purchaseDocumentType.CONFIRMATION} id="confirmation" />
                            <Label htmlFor="confirmation">Paragon</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={purchaseDocumentType.EINVOICE} id="eInvoice" />
                            <Label htmlFor="eInvoice">Faktura w formie elektronicznej</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={purchaseDocumentType.INVOICE} id="invoice" />
                            <Label htmlFor="invoice">Faktura w formie papierowej</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Informacje dodatkowe</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.addon_data}>
                    <div className={styles.addon_data_item}>
                        <h3>Uwagi do zamówienia:</h3>
                        <Textarea
                            name='order_notes'
                            id='order_notes'
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            placeholder="Wpisz uwagi do zamówienia (opcjonalne)"
                            className="resize-none"
                        />
                    </div>
                    <div className={styles.addon_data_item}>
                        <h3>Uwagi do dostawy:</h3>
                        <Textarea
                            name='delivery_notes'
                            id='delivery_notes'
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                            placeholder="Wpisz uwagi do dostawy (opcjonalne)"
                            className="resize-none"
                        />
                    </div>
                </div>
            </div>
            <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Twoje zamówienie</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.summary}>
                    <div className={styles.order}>
                        {cart?.products.map((product, index) => (
                            <div key={index} className={styles.order_item}>
                                <div className={styles.icon}>
                                    <img src={product.data.iconImage} alt="" />
                                </div>
                                <div className={styles.texts}>
                                    <h1>{product.data.name}</h1>
                                    <p>{product.worth.gross.formatted}</p>
                                    <p>{product.quantity}szt.</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.details}>
                        <div className={styles.details_item}>
                            <h3>Wartość zamówienia</h3>
                            <p>{cart?.summaryBasket.worth.gross.formatted}</p>
                        </div>
                        <div className={styles.details_item}>
                            <h3>Forma płatności</h3>
                            <p>{orderOptions?.payment === "dvp" ? "Za pobraniem" : "Płatność internetowa" }</p>
                        </div>
                        <hr />
                        <div className={styles.details_item}>
                            <h3>Dostawa</h3>
                            <p>{cart?.basketCost.basketShippingCost.shippingCost.formatted}</p>
                        </div>
                        <div className={styles.details_item}>
                            <h3>Forma dostawy</h3>
                            <p>{orderOptions?.delivery.courierName}</p>
                        </div>
                        <hr />
                        <div className={styles.details_item}>
                            <h3>Do zapłaty</h3>
                            <p>{cart?.basketCost.totalToPay.formatted}</p>
                        </div>

                        <div className="flex items-center space-x-2 mb-3 mt-6">
                            <Checkbox required id="terms" name='terms' onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
                            <label
                                htmlFor="terms"
                                className="text-sm font-small leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Akceptuję warunki <Link href="/rules">regulaminu</Link> i <Link href="/rules">politykę prywatności</Link>
                            </label>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                            <Checkbox required id="rights" name='rights' onCheckedChange={(checked) => setAcceptedRights(checked as boolean)} />
                            <label
                                htmlFor="newsletter"
                                className="text-sm font-small leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Zapoznałem się z moim <Link href="/rules">prawem do odstąpienia od umowy</Link>
                            </label>
                        </div>

                        <Button 
                            className='w-[100%] mt-2'
                            onClick={next}
                            disabled = {
                                !(cart && cart.summaryBasket.worth.gross.value > 0 && user && user.street !== "" && user.zipCode !== "" && user.city !== "" && user.firstname !== "" && user.lastname !== "" && orderOptions !== null && acceptedTerms && acceptedRights && receiptType !== null) || isPending
                            }
                        >
                            {isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                            Zamawiam i płacę ({cart?.basketCost.totalToPay.formatted})
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
