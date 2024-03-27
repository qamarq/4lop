import React from 'react'
import OrderTableComponent from '@/components/dashboard/orders/table-orders'
import { getAllOrders } from '@/actions/orders'
import DashboardTitle from '../_components/Title'

export default async function DashboardOrdersPage() {
    const orderResponse = await getAllOrders()
    
    return (
        <>
            <DashboardTitle title="Zamówienia" />

            {orderResponse.success && (
                <OrderTableComponent orders={orderResponse.orders.reverse()} />
            )}
        </>
    )
}
