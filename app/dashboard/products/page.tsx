import React from 'react'
import styles from "@/styles/Account.module.scss"
import { getAllProductsInDB } from '@/actions/products'
import ProductsTableComponent from '@/components/dashboard/products/table-products'

export default async function DashboardProductsPage() {
    const productsResponse = await getAllProductsInDB()
    return (
        <div className={styles.content}>
            <div className='h-full'>
                {productsResponse.success && (
                    <ProductsTableComponent products={productsResponse.products.map(product => { return {name: product.name, id: product.originalId, productId: product.id } })} />
                )}
            </div>
        </div>
    )
}
