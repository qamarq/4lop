import React from 'react'
import styles from '@/styles/Blog.module.scss'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function page() {
    return (
        <>
            <div className={styles.container4lop}>
                <h4 className={styles.navigation_label}><Link href="/">Strona główna</Link> <ChevronRight size={18} style={{marginInline: 6}} /> Szybkie linki <ChevronRight size={18} style={{marginInline: 6}} /> Dla małych e-sklepów</h4>
                <div className={styles.title}>
                    <h1>Dla małych e-sklepów</h1>
                    <span className={styles.line} />
                </div>

            </div>
        </>
    )
}
