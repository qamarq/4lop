"use client"

import React, { useRef, useState, useTransition } from 'react'
import styles from "@/styles/Account.module.scss"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2Icon, PencilIcon, SaveIcon } from 'lucide-react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SettingsSchema } from '@/schemas'
import { useSession } from 'next-auth/react'
import { settings } from '@/actions/settings'
import { FormSuccess } from '@/components/form-success'
import { FormError } from '@/components/form-error'
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'

export default function Account() {
    const [accountEditing, setAccountEditing] = useState(false)
    const user = useCurrentUser()
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const [isPending, startTransition] = useTransition()
    const { update } = useSession()

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            firstname: user?.firstname || undefined,
            lastname: user?.lastname || undefined,
            email: user?.email || undefined,
            phone: user?.phone || undefined,
            street: user?.street || undefined,
            city: user?.city || undefined,
            zipCode: user?.zipCode || undefined,
            country: user?.country || undefined,
            password: undefined,
            newPassword: undefined,
        }
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            settings(values)
                .then((data) => {
                    if (data.error) {
                        setError(data.error)
                    }
                    if (data.success) {
                        setSuccess(data.success)
                        update()
                        setAccountEditing(false)
                    }

                    setTimeout(() => {
                        setSuccess("")
                        setError("")
                    }, 3000)
                })
                .catch(() => setError("Something went wrong"))
        })
    }
    
    return (
        <div className={styles.content}>
            <div className={styles.header_content}>
                <h1 className={styles.content_title}>Twoje konto</h1>
                {accountEditing ? (
                    <Button 
                        type="submit"
                        disabled={isPending}
                        variant={"outline"} 
                        onClick={() => {
                            form.handleSubmit(onSubmit)()
                        }}
                    >
                        {isPending ? (
                            <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <SaveIcon className="w-4 h-4 mr-2" />
                        )}
                        Zapisz swoje dane
                    </Button>
                ) : (
                    <Button 
                        type="button"
                        variant={"outline"} 
                        onClick={() => {
                            setAccountEditing(true)
                        }}
                    >
                        <PencilIcon className="w-4 h-4 mr-2" />
                        Edytuj swoje dane
                    </Button>
                )}
            </div>
            
            <Form {...form}>
                <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                    </div>
                    <div className={styles.account_body}>
                        <FormField
                            control={form.control}
                            name="firstname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Imię</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Imię' type='firstname' disabled={isPending || !accountEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwisko</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Imię' type='lastname' disabled={isPending || !accountEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Email' type='email' disabled={true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telefon</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Telefon' type='tel' disabled={isPending || !accountEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="street"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ulica i numer domu</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Ulica' type='address' disabled={isPending || !accountEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Miasto</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Miasto' type='city' disabled={isPending || !accountEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="zipCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kod pocztowy</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Kod pocztowy' type='zipCode' disabled={isPending || !accountEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kraj</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Kraj' type='country' disabled={true} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </div> 
    )
}
