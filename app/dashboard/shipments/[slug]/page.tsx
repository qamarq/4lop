import { getProduct } from '@/actions/products'
import { BasicForm } from '@/components/dashboard/shipments/basic-form'
import { prisma } from '@/lib/db'
import { formattedPrice } from '@/lib/utils'
import React from 'react'

const getShipmentData = async (id: string) => {
    try {
        const shipmentData = await prisma.shippingMethod.findUnique({ where: { id } })
    
        return shipmentData
    } catch (err) {
        console.log("Error: ", err)
        return null
    }
}

export default async function EditShipmentPage({ params }: { params: { slug: string } }) {
    const { slug } = params
    // console.log("Slug: ", slug)
    const shipmentData = await getShipmentData(slug)
    // console.log("Shipment data: ", shipmentData)
    const exludedDataTable = shipmentData === null ? [] : await Promise.all(shipmentData.excludedProducts.map(async (productId) => {
        const product = await getProduct(productId)
        return {
            id: product?.id || "0",
            name: product?.name || productId,
            price: formattedPrice(product?.price || 0),
        }
    }))

    return (
        <div className='pl-4 w-full'>
            <BasicForm shipment={shipmentData} exludedDataTable={exludedDataTable} />
        </div>
    )
}
