'use client'

import React from 'react'
import styles from "@/styles/Summary.module.scss"
import { ChevronRight, Loader2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ReturnPayment() {
    const router = useRouter()
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
                            <Loader2Icon className="w-10 h-10 animate-spin" />
                        </div>
                        <h1 className={styles.title}>Przetwarzanie płatności</h1>
                        <h3 className={styles.subtitle}>Wpłata zostanie zaksięgowana automatycznie. Jeżeli z jakiegoś powodu nie dokończyłeś procesu płacenia, dokonaj wpłaty ponownie lub wybierz inny sposób zapłaty.</h3>

                        <Button className='w-[300px] mt-4' onClick={() => router.push("/konto/zamowienia")}>Zobacz swoje zamówienia</Button>
                    </div>
                </div>
            </div>
        </>
    )
}
