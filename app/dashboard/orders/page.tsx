import React from 'react'
import styles from "@/styles/Account.module.scss"
import { cn } from '@/lib/utils'
import OrderTableComponent from '@/components/dashboard/orders/table-orders'
import { getAllOrders } from '@/actions/orders'

export default async function DashboardOrdersPage() {
    const orderResponse = await getAllOrders()
    
    return (
        <div className={styles.content}>
            <div className='h-full'>
                {orderResponse.success && (
                    <OrderTableComponent orders={orderResponse.orders.reverse()} />
                )}
            </div>
        </div>
    )
}
