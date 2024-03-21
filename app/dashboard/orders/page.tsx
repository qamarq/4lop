import React from 'react'
import OrderTableComponent from '@/components/dashboard/orders/table-orders'
import { getAllOrders } from '@/actions/orders'

export default async function DashboardOrdersPage() {
    const orderResponse = await getAllOrders()
    
    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Zamówienia
                </h2>
            </div>

            {orderResponse.success && (
                <OrderTableComponent orders={orderResponse.orders.reverse()} />
            )}
        </>
    )
}
