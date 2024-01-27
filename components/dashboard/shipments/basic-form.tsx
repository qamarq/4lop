/* eslint-disable @next/next/no-img-element */
"use client"

import { useEffect, useRef, useState, useTransition } from "react"
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BasicShipmentSchema } from "@/schemas"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { FormSuccess } from "@/components/form-success"
import { FormError } from "@/components/form-error"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, Loader2Icon, PlusIcon, SaveIcon, Trash2Icon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { updateBasicShipmentData } from "@/actions/shipment-update"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllProductsInDB } from "@/actions/products"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const BasicForm = ({ exludedDataTable, shipment }: { exludedDataTable: {name: string, price: string, id: number}[], shipment: {
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
} | null }) => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [selectedTmpProduct, setSelectedTmpProduct] = useState<string>("")
    const [productsInDB, setProductsInDB] = useState<{name: string, id: number}[]>([])
    const router = useRouter()
    const firstTimeRef = useRef(true)

    const getProducts = async () => {
        await getAllProductsInDB()
            .then((data) => {
                if (data.success) {
                    setProductsInDB(data.products)
                }
            })
    }

    // useEffect(() => {
    //     if (shipment && shipment.excludedProducts) {
    //         const excludedProducts = shipment.excludedProducts
    //         const exludedDataTable = excludedProducts.map(async (productId): Promise<{ name: string, price: string, id: number }> => {
    //             const productRAW = await getOneProduct(parseInt(productId))
                
    //             const product = productRAW.product
    //             return {
    //                 id: product?.id || 1,
    //                 name: product?.name || "Brak nazwy",
    //                 price: product?.price.price.gross.formatted || "0",
    //             }
    //         })
    //         Promise.all(exludedDataTable).then((data) => {
    //             setExludedDataTable(data)
    //         })
    //     }
    // }, [shipment])

    useEffect(() => {
        if (firstTimeRef.current) {
            firstTimeRef.current = false
            
            getProducts()
        }
    }, [])

    const form = useForm<z.infer<typeof BasicShipmentSchema>>({
        resolver: zodResolver(BasicShipmentSchema),
        defaultValues: shipment ? {
            name: shipment.name,
            description: shipment.description,
            image: shipment.image || "",
            price: shipment.price.toString(),
            pickupPoint: shipment.pickupPoint,
            personalCollection: shipment.personalCollection,
            prepaid: shipment.prepaid,
            shippingTimeDays: shipment.shippingTimeDays.toString(),
            shippingInWeekends: shipment.shippingInWeekends,
            excluding: shipment.excluding,
            excludedProducts: shipment.excludedProducts,
        } : {
            prepaid: false,
            pickupPoint: false,
            personalCollection: false,
            shippingInWeekends: false,
            excluding: false,
            excludedProducts: [],
        }
    })

    const addNewExcludedProduct = () => {
        if (selectedTmpProduct === "") { return }
        const newExcludedProducts = [...form.getValues("excludedProducts"), selectedTmpProduct]
        form.setValue("excludedProducts", newExcludedProducts)
        form.handleSubmit(onSubmit)()
        setSelectedTmpProduct("")
    }

    const removeNewExcludedProduct = (id: number) => {
        const newExcludedProducts = form.getValues("excludedProducts").filter((productId) => productId !== id.toString())
        form.setValue("excludedProducts", newExcludedProducts)
        form.handleSubmit(onSubmit)()
    }

    const onSubmit = (values: z.infer<typeof BasicShipmentSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            updateBasicShipmentData(shipment ? shipment.id : null, values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error)
                    }
                    if (data.success) {
                        setSuccess("Zaktualizowano opcję dostawy.")
                        setTimeout(() => {
                            setSuccess("")
                        }, 3000)
                    }
                    if (data.redirect) {
                        setSuccess("Dodano nową opcję dostawy.")
                        setTimeout(() => {
                            router.push(data.redirect)
                        }, 1000)
                    }
                }) 
        })
    }

    return (
        <Card className='w-full overflow-y-auto max-h-full'>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className='flex items-center'>
                        <Button variant={"outline"} asChild>
                            <Link href="/dashboard/shipments">
                                <ChevronLeftIcon className='w-4 h-4 mr-2' />
                                Powrót
                            </Link>
                        </Button>

                        <CardTitle className="ml-2">{shipment ? shipment.name : "Dodaj nową opcję dostawy"}</CardTitle>
                    </div>
                    <Button disabled={isPending} onClick={() => {
                        console.log("save")
                        form.handleSubmit(onSubmit)()
                    }}>
                        {isPending ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <SaveIcon className='w-4 h-4 mr-2' />}
                        Zapisz
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6 mb-[3rem]'
                    >
                        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nazwa</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} placeholder='Nazwa dostawy' type='text' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Opis</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} placeholder='Opis dostawy' type='text' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='image'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zdjęcie</FormLabel>
                                        <div className="w-full flex items-center">
                                            <img src={field.value === undefined ? "fhsdkjfhdsf" : field.value} alt="" className="mr-3 w-[70px] rounded-md" onError={({ currentTarget }) => {
                                                currentTarget.onerror = null
                                                currentTarget.src = "https://placehold.co/100x70"
                                            }} />

                                            <FormControl>
                                                <Input {...field} disabled={isPending} placeholder='Link do zdjęcia dostawy' type='text' />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='price'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Cena</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center">
                                                <Input {...field} disabled={isPending} placeholder='Cena dostawy' type='number' />
                                                <span className="text-xs text-muted-foreground ml-1">PLN</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='shippingTimeDays'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Średni czas dostawy (dni)</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={isPending} placeholder='Cena dostawy' type='number' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="pickupPoint"
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                                        <div className='space-y-0.5'>
                                            <FormLabel>Paczko-punkt</FormLabel>
                                            <FormDescription>Wybierz, jeśli opcja przesyłki jest paczkomatem.</FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch 
                                                disabled={isPending}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="personalCollection"
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                                        <div className='space-y-0.5'>
                                            <FormLabel>Odbiór osobisty</FormLabel>
                                            <FormDescription>Odbiór osobisty w siedzibie 4lop. Nie paczkomat!</FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch 
                                                disabled={isPending}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="prepaid"
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                                        <div className='space-y-0.5'>
                                            <FormLabel>Płatność internetowa</FormLabel>
                                            <FormDescription>Płatność internetowa od razu na stronie, nie pobranie.</FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch 
                                                disabled={isPending}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* <div className="flex items-center gap-2">
                                <FormField
                                    control={form.control}
                                    name='minWorth'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cena minimalna</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <Input {...field} disabled={isPending} placeholder='Minimalna cena dostawy' type='number' />
                                                    <span className="text-xs text-muted-foreground ml-1">PLN</span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <span className="mx-2 text-2xl font-medium"> - </span>
                                <FormField
                                    control={form.control}
                                    name='maxWorth'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cena maksymalna</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center">
                                                    <Input {...field} disabled={isPending} placeholder='Maksymalna cena dostawy' type='number' />
                                                    <span className="text-xs text-muted-foreground ml-1">PLN</span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div> */}

                            <FormField
                                control={form.control}
                                name="shippingInWeekends"
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                                        <div className='space-y-0.5'>
                                            <FormLabel>Dostawa w weekend</FormLabel>
                                            <FormDescription>Czy dostawca obsługuje dostawę w weekendy.</FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch 
                                                disabled={isPending}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="excluding"
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm'>
                                        <div className='space-y-0.5'>
                                            <FormLabel>Wyklucz produkty</FormLabel>
                                            <FormDescription>Opcja wykluczenia danych produktów danej dostawy</FormDescription>
                                            <FormMessage />
                                        </div>
                                        <FormControl>
                                            <Switch 
                                                disabled={isPending}
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center">
                                    <div className="w-full">
                                        <CardTitle>Wykluczone produkty</CardTitle>
                                        <CardDescription>Tutaj możesz zarządzać wykluczonymi produktami dla tej opcji dostawy</CardDescription>
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button type="button" className="min-w-max">
                                                Dodaj produkt
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px]">
                                            <div className="grid gap-4">
                                                <div className="space-y-1">
                                                    <h4 className="font-medium leading-none text-lg">Wybierz produkt</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        Wybierz z listy produkt, który chcesz dodać do wykluczonych produktów.
                                                    </p>
                                                </div>

                                                <Select value={selectedTmpProduct} onValueChange={setSelectedTmpProduct}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Wybierz produkt" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-[400px]">
                                                        {productsInDB.map((product) => {
                                                            if (form.getValues("excludedProducts").includes(product.id.toString())) { return null }
                                                            return (
                                                                <SelectItem key={product.id} value={product.id.toString()}>{product.name}</SelectItem>
                                                            )
                                                        })}
                                                    </SelectContent>
                                                </Select>

                                                <div className="flex items-center justify-between">
                                                    <Button variant={"ghost"} asChild>
                                                        <Link href="/dashboard/products">Nie widzisz produktu?</Link>
                                                    </Button>
                                                    <Button disabled={selectedTmpProduct === ""} onClick={addNewExcludedProduct}>
                                                        <PlusIcon className="h-4 w-4 mr-2" />
                                                        Dodaj
                                                    </Button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col items-center justify-center py-3">
                                    {!shipment || exludedDataTable.length === 0 ? (
                                        <p className="text-sm text-muted-foreground">Brak wykluczonych produktów</p>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nazwa</TableHead>
                                                    <TableHead>Cena</TableHead>
                                                    <TableHead className="text-right"></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {exludedDataTable.map(async (excludedProduct) => {
                                                    return (
                                                        <TableRow key={excludedProduct.id}>
                                                            <TableCell><span className='font-semibold'>{excludedProduct.name}</span></TableCell>
                                                            <TableCell><span className='font-semibold'>{excludedProduct.price}</span></TableCell>
                                                            <TableCell className="text-right">
                                                                <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => removeNewExcludedProduct(excludedProduct.id)}>
                                                                    <span className="sr-only">Usuń</span>
                                                                    <Trash2Icon className="w-4 h-4" />
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })}
                                            </TableBody>
                                        </Table>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <FormSuccess message={success} />
                        <FormError message={error} />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}