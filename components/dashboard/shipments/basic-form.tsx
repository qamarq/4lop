/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useTransition } from "react"
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BasicShipmentSchema } from "@/schemas"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { ChevronLeftIcon, Loader2Icon, SaveIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { updateBasicShipmentData } from "@/actions/shipment-update"
import { useRouter } from "next/navigation"

export const BasicForm = ({ shipment }: { shipment: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    description: string;
    excludedProducts: string[];
    pickupPoint: boolean;
    companyKey: string | null;
    prepaid: boolean;
    minWorth: number;
    maxWorth: number;
    personalCollection: boolean;
    shippingTimeDays: number;
    shippingInWeekends: boolean;
} | null }) => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const router = useRouter()

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
            minWorth: shipment.minWorth.toString(),
            maxWorth: shipment.maxWorth.toString(),
        } : {
            prepaid: false,
            pickupPoint: false,
            personalCollection: false,
            shippingInWeekends: false
        }
    })

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
        <Card className='w-full'>
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
                        <div className='grid grid-cols-2 gap-4'>
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

                            <div className="flex items-center gap-2">
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
                            </div>

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
                        </div>
                        <FormSuccess message={success} />
                        <FormError message={error} />
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}