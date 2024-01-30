"use client"

import { Products } from '@prisma/client'
import React, { useState, useTransition } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminProductsSchema } from '@/schemas'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { FormSuccess } from '@/components/form-success'
import { FormError } from '@/components/form-error'
import { Button } from '@/components/ui/button'
import { Loader2Icon, SaveIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { updateProductData } from '@/actions/products'

export default function EditProductsForm({ product }: { product: Products }) {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof AdminProductsSchema>>({
        resolver: zodResolver(AdminProductsSchema),
        defaultValues: {
            price: product.priceGrossValue,
            amount: product.amount
        }
    })

    const onSubmit = (values: z.infer<typeof AdminProductsSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            updateProductData(product.id, values)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)

                    setTimeout(() => {
                        setError("")
                        setSuccess("")
                    }, 5000)
                })
        })
    }

    return (
        <div>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                >
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nowa cena (brutto)</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='123456' type='number' autoComplete="off" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='amount'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dostępność (szt.)</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='123456' type='number' autoComplete="off" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormSuccess message={success} />
                    <FormError message={error} />
                    <Button disabled={isPending} type='submit' className='w-full'>
                        {isPending ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <SaveIcon className='w-4 h-4 mr-2' />}
                        Zapisz
                    </Button>
                </form>
            </Form>
        </div>
    )
}
