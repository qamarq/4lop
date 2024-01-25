import React from 'react'
import styles from "@/styles/Account.module.scss"
import { cn } from '@/lib/utils'

export default function DashboardPage() {
    return (
        <div className={styles.content}>
            <div className={cn(styles.header_content, "justify-between")}>
                <h1 className={styles.content_title}>Dashboard</h1>
            </div>
        </div>
    )
}
