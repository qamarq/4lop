/* eslint-disable @next/next/no-img-element */
"use client"

import { Reorder } from 'framer-motion';
import React, { useEffect, useState, useTransition } from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { Loader2Icon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { deleteShipmentById, updateShipmentOrder } from '@/actions/shipment-update';
import { toast } from '@/components/ui/use-toast';

export default function ShipmentDNDList({ shipmentsList }: { shipmentsList: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    description: string;
    excludedProducts: string[];
    pickupPoint: boolean;
    companyKey: string | null;
    prepaid: boolean;
    excluding: boolean;
    personalCollection: boolean;
    shippingTimeDays: number;
    shippingInWeekends: boolean;
}[] }) {
    const [items, setItems] = useState(shipmentsList)
    const [isPending, startTransition] = useTransition()
    const [debouncedItems, setDebouncedItems] = useState(items);
    const isFirstTime = React.useRef(true);

    const onShipmentDelete = async (id: string) => {
        startTransition(() => {
            deleteShipmentById(id)
        })    
    }

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isFirstTime.current) {
                startTransition(async () => {
                    await updateShipmentOrder(debouncedItems)
                        .then((data) => {
                            // console.log(data)
                            if (data.success) {
                                toast({ description: "Zapisano kolejność opcji dostawy" })
                                location.reload()
                            }
                        })
                })
            }
            isFirstTime.current = false;
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [debouncedItems]);

    useEffect(() => {
        setDebouncedItems(items)
    }, [items]);
    
    return (
        <div className=''>
            <Reorder.Group axis="y" values={items} onReorder={setItems} className='space-y-2'>
                {items.map((item) => (
                    <Reorder.Item key={item.id} value={item}>
                        <Dialog>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Usunąć opcję dostawy?</DialogTitle>
                                    <DialogDescription>
                                        Czy na pewno chcesz usunąć &quot;{item.name}&quot;? Nie będzie on dostępny dla klientów.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant={"outline"}>Anuluj</Button>
                                    </DialogClose>
                                    <Button disabled={isPending} onClick={() => onShipmentDelete(item.id)}>
                                        {isPending && <Loader2Icon className='animate-spin mr-2 h-4 w-4' />}
                                        Usuń
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                            <div className='rounded-lg cursor-move border p-3 shadow-sm w-full overflow-y-auto bg-white flex items-center justify-between'>
                                <div className='flex items-center'>
                                    <img src={item.image || ""} alt="" className='w-[50px] object-contain rounded-md' />
                                    <div className='ml-3'>
                                        <h1 className='text-sm font-semibold'>{item.name} - {item.prepaid ? "Płatność internetowa" : "Za pobraniem"}</h1>
                                        <h2 className='text-xs font-medium'>{item.description}</h2>
                                    </div>
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Więcej</span>
                                            <MoreVerticalIcon className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        {/* <DropdownMenuLabel>Akcje</DropdownMenuLabel> */}
                                        <DropdownMenuItem>
                                            <span>Skopiuj nazwę</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link href={`/dashboard/shipments/${item.id}`}>
                                                <span>Edytuj dostawę</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem>
                                                <span>Usuń</span>
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </Dialog>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    )
}
