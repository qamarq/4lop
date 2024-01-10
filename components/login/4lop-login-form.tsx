"use client"

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { login } from '@/actions/login'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Link from 'next/link'
import { FormSuccess } from '../form-success'
import { FormError } from '../form-error'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const LopLoginForm = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider" : ""
    const callbackUrl = searchParams.get("callbackUrl")
    
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | undefined>(urlError)
    const [success, setSuccess] = useState<string | undefined>("")
    const [show2fa, setShow2fa] = useState<boolean>(false)

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })
    

    const onSubmitLogin = (values: z.infer<typeof LoginSchema>) => {
        setError("")
        setSuccess("")

        startTransition(() => {
            login(values, callbackUrl)
                .then((data) => {
                    if (data?.error) {
                        form.reset()
                        setError(data.error)
                    }

                    if (data?.success) {
                        form.reset()
                        setSuccess(data.success)
                        setTimeout(() => {
                            router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT)
                        }, 1000)
                    }

                    if (data?.twoFactorError) {
                        setError(data.twoFactorError)
                    }

                    if (data?.twoFactor) {
                        setShow2fa(true)
                    }
                }) 
        })
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmitLogin)}
                className='space-y-6'
            >
                <div className='space-y-4'>
                    {!show2fa ? (
                        <>
                            <FormField
                                control={form.control}
                                name='email'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoComplete='username' disabled={isPending} placeholder='john.doe@example.com' type='email' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Hasło</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoComplete='current-password' disabled={isPending} placeholder='******' type='password' />
                                        </FormControl>
                                        <Button
                                            size={"sm"}
                                            variant={"link"}
                                            asChild
                                            className='px-0 font-normal'
                                        >
                                            <Link href="/auth/forgot-password">
                                                Zapomniałeś hasła?
                                            </Link>
                                        </Button>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>   
                    ) : (
                        <FormField
                            control={form.control}
                            name='code'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Uwierzytelnienie dwuetapowe (aplikacja)</FormLabel>
                                    <FormControl>
                                        <Input {...field} disabled={isPending} placeholder='123456' type='number' maxLength={6} autoComplete="off" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>
                <FormSuccess className='max-w-[400px]' message={success} />
                <FormError className='max-w-[400px]' message={error} />
                <Button disabled={isPending} type='submit' className='w-full'>
                    {show2fa ? "Zweryfikuj" : "Zaloguj się"}
                </Button>
            </form>
        </Form>
    )
}