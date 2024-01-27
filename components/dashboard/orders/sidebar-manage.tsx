"use client"

import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { orderStatuses, przelewy24PaymentStatuses } from '@/constants/payment'
import { CoinsIcon, Loader2Icon, SaveIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateOrderStatuses } from '@/actions/orders'
import { orderStatusType } from '@prisma/client'
import { toast } from '@/components/ui/use-toast'
import { Separator } from '@/components/ui/separator'
import { refundPayment } from '@/actions/payment'

export default function SidebarOrderManageComponent({ orderId, defaultOrderStatus, defaultDeliveryNumber, defaultPaymentStatus }: { orderId: string, defaultOrderStatus: string, defaultDeliveryNumber: string, defaultPaymentStatus: string }) {
    const [orderStatus, setOrderStatus] = React.useState(defaultOrderStatus)
    const [deliveryNumber, setDeliveryNumber] = React.useState(defaultDeliveryNumber)
    const [paymentStatus, setPaymentStatus] = React.useState(defaultPaymentStatus)
    const [isPendingOrder, startTransitionOrder] = React.useTransition()
    const [isPendingPayment, startTransitionPayment] = React.useTransition()

    const updateOrderSettings = async () => {
        startTransitionOrder(async () => {
            await updateOrderStatuses(orderId, orderStatus as orderStatusType, deliveryNumber)
                .then((data) => {
                    if (data.success) {
                        toast({
                            description: "Zmieniono status zamówienia",
                        })
                    } else if (data.error) {
                        toast({
                            description: data.error,
                            variant: "destructive"
                        })
                    }
                })
        })
    }

    const updatePaymentSettings = async () => {
        startTransitionPayment(async () => {
            await refundPayment(orderId)
                .then(data => {
                    if (data.success) {
                        setPaymentStatus("3")
                        setOrderStatus("REFUNDED")
                        toast({
                            description: "Zwrócono płatność do klienta",
                        })
                    } else if (data.error) {
                        toast({
                            description: data.error,
                            variant: "destructive"
                        })
                    }
                })
        })
    }

    return (
        <div className='flex flex-col gap-1'>
            {/* <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Wybierz status płatności" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Statusy płatności</SelectLabel>
                    {Object.entries(przelewy24PaymentStatuses).map(([key, value]) => ( 
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                    </SelectGroup>
                </SelectContent>
            </Select> */}
            <div className="grid w-full mb-2 items-center gap-1.5">
                <Label>Status zamówienia</Label>
                <Select value={orderStatus} onValueChange={setOrderStatus}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Wybierz status zamówienia" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Statusy zamówienia</SelectLabel>
                        {Object.entries(orderStatuses).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="grid w-full mb-2 items-center gap-1.5">
                <Label htmlFor="delivery">Numer śledzenia przesyłki</Label>
                <Input value={deliveryNumber} onChange={(e) => setDeliveryNumber(e.target.value)} id="delivery" type="text" placeholder='Numer śledzenia' />
            </div>
            <Button disabled={isPendingOrder} onClick={updateOrderSettings}>
                {isPendingOrder ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <SaveIcon className='w-4 h-4 mr-2' />}
                Zapisz zmiany
            </Button>

            <Separator className='my-3' />

            <Button disabled={paymentStatus !== "2" || isPendingPayment} onClick={updatePaymentSettings}>
                {isPendingPayment ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <CoinsIcon className='w-4 h-4 mr-2' />}
                Zwróć płatność do klienta
            </Button>
        </div>
    )
}
