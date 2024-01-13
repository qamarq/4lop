/* eslint-disable @next/next/no-img-element */
import React from 'react'
import styles from "@/styles/Account.module.scss"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CopyIcon, MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/db'
import { formattedPrice } from '@/lib/utils'

const getShipmentsList = async () => {
    const shipmentList = await prisma.shippingMethod.findMany()
    return shipmentList
}

export default async function ShipmentsPage() {
    const shipmentsList = await getShipmentsList()

    return (
        <div className={styles.content}>
            <div className={styles.header_content}>
                <h1 className={styles.content_title}>Opcje dostawy</h1>
            </div>

            <div className='mt-1 h-full'>
                <div className='rounded-lg border p-3 shadow-sm w-full overflow-y-auto h-full'>
                    <Table>
                        <TableCaption>Lista wszystkich opcji dostawy w bazie</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nazwa</TableHead>
                                <TableHead>Cena</TableHead>
                                <TableHead>Dostawa</TableHead>
                                <TableHead>Minimalna cena</TableHead>
                                <TableHead>Wykluczone</TableHead>
                                <TableHead className="text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {shipmentsList.map((shipmentItem) => (
                                <TableRow key={shipmentItem.name}>
                                    <TableCell className="font-medium">
                                        <div className='flex items-center'>
                                            <img src={shipmentItem.image || ""} width={60} alt="" className='' />
                                            <div className='ml-3'>
                                                <h1 className='text-sm font-semibold'>{shipmentItem.name}</h1>
                                                <h2 className='text-xs font-medium'>{shipmentItem.description}</h2>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><span className='font-semibold'>{formattedPrice(shipmentItem.price)}</span></TableCell>
                                    <TableCell>{shipmentItem.shippingTimeDays} dni</TableCell>
                                    <TableCell>{formattedPrice(shipmentItem.minWorth)}</TableCell>
                                    <TableCell>{shipmentItem.excludedProducts.length} prod.</TableCell>
                                    <TableCell className="text-right">
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
                                                    <CopyIcon className="mr-2 h-4 w-4" />
                                                    <span>Skopiuj nazwę</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <PencilIcon className="mr-2 h-4 w-4" />
                                                    <span>Edytuj dostawę</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <TrashIcon className="mr-2 h-4 w-4" />
                                                    <span>Usuń</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        {/* <TableFooter>
                            <TableRow>
                                <TableCell colSpan={4}>Liczba opcji dostawy</TableCell>
                                <TableCell className="text-right">{shipmentsList.length}</TableCell>
                            </TableRow>
                        </TableFooter> */}
                    </Table>
                </div>
            </div>
        </div>
    )
}
