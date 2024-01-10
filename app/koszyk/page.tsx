"use client"

import React, { useEffect, useState } from 'react'
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { ChevronRight, ChevronDown, ShoppingCartIcon, MoreHorizontal, EyeIcon, CopyIcon, TrashIcon, PencilLineIcon, Loader2Icon, RotateCcwIcon } from "lucide-react"
import styles from "@/styles/Cart.module.scss"
import { useRouter } from 'next/navigation'
import basketIcon from "@/assets/icons/basket.svg";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { columns } from '@/components/columns'
import { Label } from '@/components/ui/label'
import { prepareLink } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';


export default function CartPage() {
    const router = useRouter()
    const { 
        loading: cartLoading, 
        cart, 
        updateItem, 
        removeItem,
        refreshCart
    } = useCart();

    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [loading, setLoading] = useState(false)
    const [updateQuantityValue, setUpdateQuantityValue] = useState(1)
    const [tmpVal, setTmpVal] = useState<{
        id: number;
        size: string;
        quantity: number;
    } | null>(null)
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [dialogDeleteOpened, setDialogDeleteOpened] = useState(false);
    const [dialogUpdateOpened, setDialogUpdateOpened] = useState(false);
    
    const table = useReactTable({
        data: cart ? cart.products : [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    // useEffect(() => {
    //     async function test() {
    //         const response = await fetch('/api/shop/basket/get', {
    //             method: 'POST',
    //             body: JSON.stringify({}),
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    
    //         if (response.ok) {
    //             console.log("ok")
    //         } else {
    //             console.log("nope")
    //         }
    //     }

    //     test()
    // }, [])

    useEffect(() => {
        refreshCart()
    }, [])

    const deleteItemLocal = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // prevent
        if (tmpVal) {
            setLoading(true)
            await removeItem(tmpVal.id, tmpVal.size)
            setTmpVal(null)
            setLoading(false)
            setDialogDeleteOpened(false)
        }
    }

    const updateItemLocal = async () => {
        if (tmpVal) {
            setLoading(true)
            await updateItem({
                id: tmpVal.id,
                size: tmpVal.size,
                quantity: updateQuantityValue
            })
            setTmpVal(null)
            setLoading(false)
        }
    }

    return (
        <>
            <div className={styles.container}>
                <h4 className={styles.navigation_label}>Strona główna <ChevronRight size={18} style={{marginInline: 6}} /> Koszyk</h4>
                <div className={styles.title}>
                    <h1>Koszyk</h1>
                    <span className={styles.line} />
                </div>

                <Dialog open={dialogUpdateOpened} onOpenChange={(open) => setDialogUpdateOpened(open)}>
                    <DialogContent className="sm:max-w-[445px]">
                        <DialogHeader>
                            <DialogTitle>Edytuj wartość</DialogTitle>
                            <DialogDescription>
                                Podaj ilość produktu, którą chcesz mieć w koszyku
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-3">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="updateQuantity" className="text-right">
                                    Ilość
                                </Label>
                                <Input
                                    id="updateQuantity"
                                    type='number'
                                    placeholder='Podaj ilość'
                                    value={updateQuantityValue}
                                    onChange={(e) => setUpdateQuantityValue(parseInt(e.target.value))}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={() => {
                                updateItemLocal()
                                setDialogUpdateOpened(false)
                            }}>
                                <PencilLineIcon className='h-4 w-4 mr-2' />
                                Zapisz zmiany
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <AlertDialog open={dialogDeleteOpened} onOpenChange={(open) => setDialogDeleteOpened(open)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Czy jesteś pewny?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Jesteś pewny że chcesz usunąć ten produkt z koszyka? Ta akcja jest nieodwracalna
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Anuluj</AlertDialogCancel>
                            <AlertDialogAction disabled={loading} onClick={(e) => deleteItemLocal(e)}>
                                {loading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <TrashIcon className="mr-2 h-4 w-4" />}
                                <span>Usuń z koszyka</span>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {cartLoading || cart && cart.products.length === 0 ? (
                    <div className={styles.empty_cart}>
                        <div className={styles.inner_empty_cart}>
                            <Image src={basketIcon} alt="Ikonka koszyka" />
                            <h1>Oops! Twój koszyk jest pusty</h1>
                            <h2>Dodaj do niego produkty, aby móc rozpocząć składanie zamówienia.</h2>
                            <Button onClick={() => router.push("/sklep")}>Rozpocznij zakupy</Button>
                        </div>
                    </div>
                ) : (
                    // <div className={styles.full_cart}>
                    //     <div className={styles.inner_full_cart}>
                    //         <div className={styles.cart_items}>
                    //             {cart && cart.products.map((cartItem) => (
                    //                 <div key={v4()} className={styles.cart_item}>
                    //                     <Checkbox checked={true} />
                    //                     <div className={styles.thumbnail}>
                    //                         <img src={`https://elektromaniacy.pl/${cartItem.data.icon}`} alt={cartItem.data.name} />
                    //                     </div>
                    //                     <div className={styles.content_item}>
                    //                         <div className={styles.content_item_title}>
                    //                             <h1>{cartItem.data.name}</h1>
                    //                             <div className={styles.button_del}>
                    //                                 <XIcon size={20} />
                    //                             </div>
                    //                         </div>
                    //                         <div className={styles.content_subitem}>
                    //                             <p>Ilość</p>
                    //                             <div className={styles.counter}>
                    //                                 <div className={styles.counter_btn} onClick={() => {
                    //                                     // if (cartItem.count > 1) {
                    //                                     //     updateItem({
                    //                                     //         id: cartItem.id,
                    //                                     //         value: {
                    //                                     //             count: cartItem.count - 1
                    //                                     //         }
                    //                                     //     })
                    //                                     // } else {
                    //                                     //     removeItem(cartItem.id)
                    //                                     // }
                    //                                 }}>
                    //                                     <MinusIcon size={14} />
                    //                                 </div>
                    //                                 <div className={styles.counter_display}>
                    //                                     <p>{cartItem.quantity}</p>
                    //                                 </div>
                    //                                 <div className={styles.counter_btn} onClick={() => {
                    //                                     // updateItem({
                    //                                     //     id: cartItem.id,
                    //                                     //     value: {
                    //                                     //         count: cartItem.count + 1
                    //                                     //     }
                    //                                     // })
                    //                                 }}>
                    //                                     <PlusIcon size={14} />
                    //                                 </div>
                    //                             </div>
                    //                         </div>
                    //                         <div className={styles.content_subitem}>
                    //                             <p>Cena jednego produktu</p>
                    //                             <h1>{cartItem.data.price.price.gross.formatted}</h1>
                    //                         </div>
                    //                         <div className={styles.content_subitem}>
                    //                             <p>Wartość w całości</p>
                    //                             <h1>{(cartItem.data.price.price.gross.value*cartItem.quantity).toFixed(2)}zł</h1>
                    //                         </div>
                    //                     </div>
                    //                 </div>
                    //             ))}
                    //         </div>
                    //         <div className={styles.cart_summary}>
                    //             <div className={styles.summary_item}>
                    //                 <p>Wartość zamówienia:</p>
                    //                 <h1>9zł</h1>
                    //             </div>
                    //             <div className={styles.summary_item}>
                    //                 <p>Ilość przedmiotów:</p>
                    //                 <h1>x100</h1>
                    //             </div>
                    //             <hr />
                    //             <div className={styles.summary_main_item}>
                    //                 <p>Do zapłaty:</p>
                    //                 <h1>9zł</h1>
                    //             </div>
                    //             <div className={styles.buttons}>
                    //                 <Button className={styles.btn_cart}>
                    //                     Przejdź dalej
                    //                 </Button>
                    //                 <Button className={styles.btn_cart} variant={"outline"}>
                    //                     Kontynuuj zakupy
                    //                 </Button>
                    //             </div>
                    //         </div>
                    //     </div>
                    // </div>

                    <div className="w-full">
                        <div className="flex items-center py-4">
                            <Input
                                placeholder="Filtruj nazwy..."
                                value={(table.getColumn("nazwa")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("nazwa")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="ml-auto">
                                    Kolumny <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {table
                                        .getAllColumns()
                                        .filter((column) => column.getCanHide())
                                        .map((column) => {
                                            return (
                                                <DropdownMenuCheckboxItem
                                                    key={column.id}
                                                    className="capitalize"
                                                    checked={column.getIsVisible()}
                                                    onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                    }
                                                >
                                                    {column.id}
                                                </DropdownMenuCheckboxItem>
                                            )
                                    })}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button variant="outline" className="ml-1" onClick={() => {
                                refreshCart()
                                toast({
                                    description: "Odświeżono koszyk",
                                })
                            }}>
                                <RotateCcwIcon className="h-4 w-4 text-gray-800" />
                            </Button>
                        </div>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => {
                                            const name = row.original.data.name;
                                            const link = `/sklep/produkt/${prepareLink(row.original.data.link)}`

                                            return (
                                                <TableRow
                                                    key={row.id}
                                                    data-state={row.getIsSelected() && "selected"}
                                                >
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id}>
                                                            {flexRender(
                                                                cell.column.columnDef.cell,
                                                                cell.getContext()
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell key={"actions"}>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Więcej</span>
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {/* <DropdownMenuLabel>Akcje</DropdownMenuLabel> */}
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(name)
                                                                        toast({
                                                                            description: "Skopiowano do schowka"
                                                                        })
                                                                    }}>
                                                                        <CopyIcon className="mr-2 h-4 w-4" />
                                                                        <span>Skopiuj nazwę</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => 
                                                                    window.location.href = link
                                                                }>
                                                                    <EyeIcon className="mr-2 h-4 w-4" />
                                                                    <span>Zobacz produkt</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => {
                                                                    setTmpVal({
                                                                        id: row.original.id,
                                                                        size: row.original.size,
                                                                        quantity: row.original.quantity
                                                                    })
                                                                    setUpdateQuantityValue(row.original.quantity)
                                                                    setDialogUpdateOpened(true)
                                                                }}>
                                                                    <PencilLineIcon className="mr-2 h-4 w-4" />
                                                                    <span>Zmień ilość</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => {
                                                                    setTmpVal({
                                                                        id: row.original.id,
                                                                        size: row.original.size,
                                                                        quantity: row.original.quantity
                                                                    })
                                                                    setDialogDeleteOpened(true)
                                                                }}>
                                                                    <TrashIcon className="mr-2 h-4 w-4" />
                                                                    <span>Usuń</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                Brak produktów
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-end space-x-2 py-4">
                            <div className="flex-1 text-sm text-muted-foreground">
                                Zaznaczono {table.getFilteredSelectedRowModel().rows.length} z{" "}
                                {table.getFilteredRowModel().rows.length} wierszy.
                            </div>
                            <div className="space-x-2 mt-2 flex sm:block sm:mt-0">
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Poprzednie
                                </Button>
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Następne
                                </Button>
                                <Button disabled={cart?.products.length === 0} onClick={() => {
                                    router.push("/koszyk/zamowienie")
                                }}>
                                    Przejdź do zamawiania
                                    <ShoppingCartIcon className='w-4 h-4 ml-2' />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
