/* eslint-disable @next/next/no-img-element */
import React from 'react'
import styles from "@/styles/Account.module.scss"
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import ShipmentDNDList from '@/components/dashboard/shipments/dnd-list'

const getShipmentsList = async () => {
    const shipmentList = await prisma.shippingMethod.findMany({ orderBy: { numberInOrder: "asc" } })
    return shipmentList
}

export default async function ShipmentsPage() {
    const shipmentsList = await getShipmentsList()

    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Opcje dostawy
                </h2>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/dashboard/shipments/new">
                            <PlusIcon className='w-4 h-4 mr-2' />
                            Dodaj nową
                        </Link>
                    </Button>
                </div>
            </div>

            <div className='mt-1 h-full'>
                <div className='rounded-lg border p-3 shadow-sm w-full overflow-y-auto h-full'>
                    <ShipmentDNDList shipmentsList={shipmentsList} />
                </div>
            </div>
        </>
    )
}
