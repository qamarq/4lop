'use client'

import { ChevronRight, CreditCardIcon } from 'lucide-react'
import styles from "@/styles/Summary.module.scss"
import { Elements } from "@stripe/react-stripe-js";
import { useSearchParams } from 'next/navigation'
import { StripeElementLocale, loadStripe } from "@stripe/stripe-js";
import React from 'react'
import { PaymentForm } from '@/components/payment-form';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function Payment() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get('orderNumber')
    const clientSecret = searchParams.get('paymentSecret') || ""

    const appearance = {
        theme: 'stripe' as "stripe",
        variables: {
            colorPrimary: '#f97316',
        },
    };

    const options = {
        clientSecret,
        appearance,
        locale: 'pl' as StripeElementLocale
    };

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
                    <div className={styles.payment_card}>
                        <div className={styles.icon_payment}>
                            <CreditCardIcon className={styles.icon_svg} />
                        </div>
                        <h1 className={styles.title}>Zamówienie <span>#{orderNumber}</span> zostało przyjęte i oczekuje na płatność</h1>
                        {clientSecret && (
                            <Elements options={options} stripe={stripePromise}>
                                <PaymentForm />
                            </Elements>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
