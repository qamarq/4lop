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

export default function SidebarOrderManageComponent() {
    return (
        <div className='flex flex-col gap-1'>
            <Select>
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
            </Select>
            <Select>
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
    )
}
