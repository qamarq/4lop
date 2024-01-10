"use client"

import React, { useEffect, useRef, useState, useTransition } from 'react'
import styles from "@/styles/Summary.module.scss"
import { AlertOctagonIcon, CheckIcon, ChevronRight, Loader2Icon } from 'lucide-react'
import { getPaymentStatus } from '@/actions/payment'
import { useSearchParams } from 'next/navigation'
import { PaymentStatus, paymentStatuses } from '@/constants/payment'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function PaymentSummaryPage() {
    const searchParams = useSearchParams()
    const paymentId = searchParams.get('payment_intent') || ""
    const fetchedRef = useRef(false)
    const [isPending, startTransition] = useTransition()
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("processing")

    const checkPayment = () => {
        startTransition(async () => {
            await getPaymentStatus(paymentId)
                .then((data) => {
                    if (data.success) {
                        setPaymentStatus(data.payment.status)
                    }
                })
        })
    }

    useEffect(() => {
        if (!fetchedRef.current) {
            checkPayment()
            fetchedRef.current = true
        }
    }, [])

    return (
        <>
            <div className={styles.container}>
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
                            'bg-sky-500/15 text-sky-500': paymentStatus === "processing" || isPending,
                            'bg-emerald-500/15 text-emerald-500': paymentStatus === "succeeded",
                            'bg-red-500/15 text-red-500': paymentStatus !== "processing" && paymentStatus !== "succeeded"
                        })}>
                            {isPending ? <Loader2Icon className='w-6 h-6 animate-spin' /> : (
                                <>
                                    {paymentStatus === "processing" && <Loader2Icon className='w-6 h-6 animate-spin' />}
                                    {paymentStatus === "succeeded" && <CheckIcon className='w-6 h-6' />}
                                    {paymentStatus !== "processing" && paymentStatus !== "succeeded" && paymentStatus !== null && <AlertOctagonIcon className='w-6 h-6' />}
                                </>
                            )}
                        </div>
                        <h1 className='font-semibold text-2xl text-center'>{isPending ? "Przetwarzanie płatności..." : paymentStatuses[paymentStatus || "processing"] }</h1>
                        <Button className='w-full max-w-[400px] mt-8'>
                            Przejdź do swojego zamówienia
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}
