"use client"

import * as z from 'zod'
import { RegisterSchema } from "@/schemas"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { register } from '@/actions/register'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from '../ui/input'
import { FormSuccess } from '../form-success'
import { FormError } from '../form-error'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { AccountType } from '@prisma/client'
import { Checkbox } from '../ui/checkbox'
import Link from 'next/link'

export const LopRegisterForm = () => {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            firstname: '',
            lastname: '',
            street: '',
            city: '',
            zip: '',
            phone: '',
            accountType: undefined,
            rulesAccepted: false,
            newsLetter: false,
        }
    })

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            register(values)
                .then((data) => {
                    setSuccess(data.success)
                    setError(data.error)

                    if (data.success) {
                        form.reset()
                    }
                }) 
        })
    }
    
    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
            >
                <div className='space-y-4'>
                    <div className='flex flex-col sm:flex-row items-center gap-2'>
                        <FormField
                            control={form.control}
                            name='firstname'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Imię</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='Imię' type='firstname' autoComplete='firstname' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='lastname'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwisko</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='Nazwisko' type='lastname' autoComplete='lastname' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                        control={form.control}
                        name='street'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ulica</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder='Ulica i numer domu' type='address' autoComplete='address' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className='flex flex-col sm:flex-row items-center gap-2'>
                        <FormField
                            control={form.control}
                            name='city'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Miasto</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='Miasto' type='city' autoComplete='city' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='zip'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kod pocztowy</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='Kod pocztowy' type='postal' autoComplete='postal-code' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='flex flex-col sm:flex-row items-center gap-2'>
                        <FormField
                            control={form.control}
                            name='phone'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Numer telefonu</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='+48 500 000 000' type='tel' autoComplete='phone' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='john.doe@example.com' type='email' autoComplete='email' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hasło (min 8 znaków)</FormLabel>
                                <FormControl>
                                    <Input {...field} disabled={isPending} placeholder='********' type='password' autoComplete='new-password' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="accountType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Typ konta</FormLabel>
                                <Select 
                                    disabled={isPending}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={"Wybierz typ konta"} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={AccountType.WOMEN}>
                                            Kobieta
                                        </SelectItem>  
                                        <SelectItem value={AccountType.MAN}>
                                            Mężczyzna
                                        </SelectItem>
                                        <SelectItem value={AccountType.OTHER}>
                                            Nie chcę podawać
                                        </SelectItem>
                                        <SelectItem value={AccountType.BUSINESS}>
                                            Konto firmowe
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rulesAccepted"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Checkbox disabled={isPending} checked={field.value} onCheckedChange={field.onChange} />
                                        <label
                                            htmlFor="terms"
                                            className="text-sm font-small leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Akceptuję warunki <Link href="/rules">regulaminu</Link> i <Link href="/rules">politykę prywatności</Link>
                                        </label>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="newsLetter"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="items-top flex space-x-2 mb-3">
                                        <Checkbox disabled={isPending} checked={field.value} onCheckedChange={field.onChange} />
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="newsletter"
                                                className="text-sm font-small leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Chcę otrzymywać Newsletter
                                            </label>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                (możliwość póżniejszej rezygnacji)
                                            </p>
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormSuccess className='max-w-[400px]' message={success} />
                <FormError className='max-w-[400px]' message={error} />
                <Button disabled={isPending} type='submit' className='w-full'>
                    Stwórz swoje konto
                </Button>
            </form>
        </Form>
    )
}