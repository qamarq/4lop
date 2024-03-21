/* eslint-disable @next/next/no-img-element */
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
import { ChevronRight, ChevronDown, ShoppingCartIcon, MoreHorizontal, EyeIcon, CopyIcon, TrashIcon, PencilLineIcon, Loader2Icon, RotateCcwIcon, LogInIcon, ServerOffIcon } from "lucide-react"
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
import { createSlugLink, formattedPrice, prepareLink } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { useCurrentUser } from '@/hooks/use-current-user';
import { LOCALSTORAGE_TMPCART_KEY_NAME } from '@/constants';
import { prepareBasketProducts } from '@/actions/basket';
import { v4 } from 'uuid';


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
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [loading, setLoading] = useState(false)
    const [updateQuantityValue, setUpdateQuantityValue] = useState(1)
    const [tmpVal, setTmpVal] = useState<{
        id: string;
        size: string;
        quantity: number;
    } | null>(null)
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [dialogDeleteOpened, setDialogDeleteOpened] = useState(false);
    const [dialogUpdateOpened, setDialogUpdateOpened] = useState(false);
    const [isPendingNotEnough, startTransitionNotEnough] = React.useTransition()
    const [notEnoughProducts, setNotEnoughProducts] = useState<{ productId: string; quantity: number; productDetails: ProductDBWithNumberPrice }[] | null>(null)
    const user = useCurrentUser()
    const firstTimeRef = React.useRef(true)
    
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

    const prepareNotEnought = async () => {
        const notEnoughProductsRAW = localStorage.getItem(LOCALSTORAGE_TMPCART_KEY_NAME)
        if (notEnoughProductsRAW) {
            const notEnoughProducts = JSON.parse(notEnoughProductsRAW) as { id: string; quantity: number; }[]
            startTransitionNotEnough(async () => {
                await prepareBasketProducts(notEnoughProducts)
                    .then((data) => {
                        setNotEnoughProducts(data)
                    })
            })
        }
    }

    useEffect(() => {
        if (firstTimeRef.current) {
            refreshCart()
            prepareNotEnought()
            firstTimeRef.current = false
        }
    }, [])

    const deleteItemLocal = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation(); // prevent
        if (tmpVal) {
            setLoading(true)
            await removeItem(tmpVal.id)
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
                            {/* <Button variant="outline" className="ml-1" onClick={() => {
                                refreshCart()
                                toast({
                                    description: "Odświeżono koszyk",
                                })
                            }}>
                                <RotateCcwIcon className="h-4 w-4 text-gray-800" />
                            </Button> */}
                            <Button 
                                className="ml-1" 
                                variant={"outline"} 
                                disabled={table.getFilteredSelectedRowModel().rows.length === 0}
                                onClick={() => {
                                    table.getFilteredSelectedRowModel().rows.map((row) => {
                                        removeItem(row.original.id)
                                    })
                                }}
                            >
                                Usuń zaznaczone ({table.getFilteredSelectedRowModel().rows.length})
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
                                            const link = createSlugLink(name, row.original.id)

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
                                    {isPendingNotEnough && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={columns.length}
                                                className="h-24 text-center"
                                            >
                                                <div className='flex items-center'>
                                                    <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />Ładowanie pozostałych produktów...
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {notEnoughProducts && notEnoughProducts.length > 0 && (
                                        <>
                                            {notEnoughProducts.map((product) => {
                                                return (
                                                    <TableRow key={product.productId}>
                                                        <TableCell></TableCell>
                                                        <TableCell>
                                                            <div className="capitalize w-[70px] h-[70px] rounded-md bg-[#eee] flex items-center justify-center">
                                                                <img className='w-[80%] max-h-[80%] mix-blend-multiply' src={product.productDetails.iconImage} alt="" />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="capitalize">
                                                                <h1 className='font-bold text-[1.7rem]'>{product.productDetails.name}</h1>
                                                                <h2 className='truncate max-w-[300px] font-semibold'><span className='text-gray-500 font-medium'>Opis: </span>{product.productDetails.shortDescription}</h2>
                                                                {product.productDetails.variant && (
                                                                    <h2 className='truncate max-w-[300px] font-semibold'><span className='text-gray-500 font-medium'>Wersja: </span>{product.productDetails.variant}</h2>
                                                                )}
                                                                <h2 className='truncate max-w-[300px] font-semibold normal-case'><span className='text-gray-500 font-medium'>Cena/szt.: </span>{formattedPrice(product.productDetails.price)}</h2>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            0 szt.
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className='text-right font-medium'><p className='text-rose-500'>Skontaktuj się,<br/> aby zapytać o dostępność</p></div>
                                                        </TableCell>
                                                        <TableCell><ServerOffIcon className='w-4 h-4 text-rose-500' /></TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                            <TableRow>
                                                <TableCell
                                                    colSpan={columns.length+1}
                                                    className="h-24 text-center"
                                                >
                                                    <div className='flex items- justify-end'>
                                                        <Button variant={"outline"} onClick={() => {
                                                            setNotEnoughProducts(null)
                                                            localStorage.removeItem(LOCALSTORAGE_TMPCART_KEY_NAME)
                                                        }}>
                                                            <TrashIcon className='w-4 h-4 mr-2' />
                                                            Usuń niedostępne produkty
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </>
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
                                {user !== undefined ? (
                                    <Button disabled={cart?.products.length === 0} onClick={() => {
                                        router.push("/koszyk/zamowienie")
                                        localStorage.removeItem(LOCALSTORAGE_TMPCART_KEY_NAME)
                                    }}>
                                        Przejdź do zamawiania
                                        <ShoppingCartIcon className='w-4 h-4 ml-2' />
                                    </Button>
                                ) : (
                                    <Button disabled={cart?.products.length === 0} onClick={() => {
                                        router.push("/login")
                                    }}>
                                        Zaloguj się, aby przejść dalej
                                        <LogInIcon className='w-4 h-4 ml-2' />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
