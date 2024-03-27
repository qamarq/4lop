import React from 'react'
import styles from '@/styles/FastLink.module.scss'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function page() {
    return (
        <>
            <div className={styles.container4lop}>
                <h4 className={styles.navigation_label}><Link href="/">Strona główna</Link> <ChevronRight size={18} style={{marginInline: 6}} /> Szybkie linki <ChevronRight size={18} style={{marginInline: 6}} /> Ekspresowe wysyłki</h4>
                <div className={styles.title}>
                    <h1>Opcje dostawy</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.delivery}>
                    <div className={styles.card}>
                        <h2>Kurier GLS</h2>
                        <div className={styles.icon} style={{ backgroundImage: 'url(/couriers/kurier_gls.png)'}}></div>
                        <h1>20 PLN</h1>
                        <h3>Za pobraniem 25 PLN</h3>
                    </div>
                    <div className={styles.card}>
                        <h2>Kurier InPost</h2>
                        <div className={styles.icon} style={{ backgroundImage: 'url(/couriers/kurier_ip.png)'}}></div>
                        <h1>20 PLN</h1>
                        <h3>Za pobraniem 25 PLN</h3>
                    </div>
                    <div className={styles.card}>
                        <h2>Paczkomaty InPost</h2>
                        <div className={styles.icon} style={{ backgroundImage: 'url(/couriers/paczkomat.png)'}}></div>
                        <h1>15 PLN</h1>
                        <h3>Za pobraniem 20 PLN</h3>
                    </div>
                    <div className={styles.card}>
                        <h2>Paleta</h2>
                        <div className={styles.icon} style={{ backgroundImage: 'url(/couriers/d_paleta.png)'}}></div>
                        <h1>149 PLN</h1>
                    </div>
                </div>
            </div>
        </>
    )
}
