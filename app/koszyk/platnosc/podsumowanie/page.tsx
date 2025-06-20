"use client"

import React, { useEffect, useRef, useState, useTransition } from 'react'
import styles from "@/styles/Summary.module.scss"
import { AlertOctagonIcon, CheckIcon, ChevronRight, Loader2Icon } from 'lucide-react'
import { getPaymentStatus } from '@/actions/payment'
import { useSearchParams } from 'next/navigation'
import { Przelewy24PaymentStatus, paymentStatuses, przelewy24PaymentStatuses } from '@/constants/payment'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PaymentSummaryPage() {
    const searchParams = useSearchParams()
    const paymentId = searchParams.get('sessionID') || ""
    const fetchedRef = useRef(false)
    const [isPending, startTransition] = useTransition()
    const [paymentStatus, setPaymentStatus] = useState<Przelewy24PaymentStatus>("0")
    const [orderNumber, setOrderNumber] = useState("")

    const checkPayment = () => {
        startTransition(async () => {
            await getPaymentStatus(paymentId)
                .then((data) => {
                    if (data.success) {
                        setPaymentStatus(data.payment.status.toString())
                        setOrderNumber(data.payment.orderNumber.toString())
                    }
                })
        })
    }

    useEffect(() => {
        if (!fetchedRef.current) {
            checkPayment()
            fetchedRef.current = true
        }

        const interval = setInterval(() => {
            checkPayment()
        }, 10000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return (
        <>
            <div className={styles.container4lop}>
                <h4 className={styles.navigation_label}>
                    Strona główna 
                    <ChevronRight size={18} style={{marginInline: 6}} /> 
                    Koszyk
                    <ChevronRight size={18} style={{marginInline: 6}} /> 
                    Płatność
                </h4>
                
                <div className={styles.payment_container}>
                    <div className='w-full mt-4 rounded-lg border p-[5rem] shadow-sm bg-gray-100 flex flex-col items-center justify-center'>
                        <div className={cn('mb-5 w-[60px] h-[60px] flex items-center justify-center rounded-md', {
                            'bg-sky-500/15 text-sky-500': paymentStatus === "0" || isPending,
                            'bg-emerald-500/15 text-emerald-500': paymentStatus === "2",
                            'bg-red-500/15 text-red-500': paymentStatus !== "0" && paymentStatus !== "2"
                        })}>
                            {isPending ? <Loader2Icon className='w-6 h-6 animate-spin' /> : (
                                <>
                                    {paymentStatus === "0" && <Loader2Icon className='w-6 h-6 animate-spin' />}
                                    {paymentStatus === "2" && <CheckIcon className='w-6 h-6' />}
                                    {paymentStatus !== "0" && paymentStatus !== "2" && paymentStatus !== null && <AlertOctagonIcon className='w-6 h-6' />}
                                </>
                            )}
                        </div>
                        <h1 className='font-semibold text-2xl text-center'>{isPending ? "Przetwarzanie płatności..." : przelewy24PaymentStatuses[paymentStatus || "0"] }</h1>
                        <Button disabled={orderNumber === ""} className='w-full max-w-[400px] mt-8' asChild>
                            <Link href={`/konto/zamowienia/${orderNumber}`}>
                                Przejdź do swojego zamówienia
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
