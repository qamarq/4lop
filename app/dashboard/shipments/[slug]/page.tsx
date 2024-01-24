import { BasicForm } from '@/components/dashboard/shipments/basic-form'
import { prisma } from '@/lib/db'
import React from 'react'

const getShipmentData = async (id: string) => {
    try {
        const shipmentData = await prisma.shippingMethod.findUnique({
            where: {
                id: id
            }
        })
    
        return shipmentData
    } catch (err) {
        console.log("Error: ", err)
        return null
    }
}

export default async function EditShipmentPage({ params }: { params: { slug: string } }) {
    const { slug } = params
    const shipmentData = await getShipmentData(slug)

    return (
        <div className='p-4 w-full'>
            <BasicForm shipment={shipmentData} />
        </div>
    )
}
