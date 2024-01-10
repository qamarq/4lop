"use client"

import React, { useState, useTransition } from 'react'
import styles from "@/styles/Account.module.scss"
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { TwoFactorForm } from '@/components/auth/2fa-form'
import { Switch } from '@/components/ui/switch'
import { disableTwoFactor } from '@/actions/manage-2fa'
import { useSession } from 'next-auth/react'
import { useCurrentUser } from '@/hooks/use-current-user'
import { FormSuccess } from '@/components/form-success'
import { FormError } from '@/components/form-error'
import { Button } from '@/components/ui/button'
import { Loader2Icon, PencilIcon, SaveIcon } from 'lucide-react'
import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChangePassSchema } from '@/schemas'
import { settings } from '@/actions/settings'
import { Input } from '@/components/ui/input'

export default function ChangePassword() {
    const [twoFactorDialogOpened, setTwoFactorDialogOpened] = useState<boolean>(false)
    const [error, setError] = useState<string | undefined>("")
    const [success, setSuccess] = useState<string | undefined>("")
    const { update } = useSession()
    const [isPending, startTransition] = useTransition()
    const user = useCurrentUser()
    const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(user?.isTwoFactorEnabled || false)

    const [passwordEditing, setPasswordEditing] = useState(false)

    const on2faChange = (value: boolean | undefined) => {
        if (value === undefined) {
            return
        }

        if (value === true) {
            setTwoFactorDialogOpened(true)
        } else {
            startTransition(async () => {
                await disableTwoFactor()
                    .then((data) => {
                        if (data.success && data.success !== undefined) {
                            setTwoFactorEnabled(false)
                            update()
                            setSuccess("Uwierzytelnienie dwuetapowe zostało wyłączone pomyślnie")
                        } else {
                            setTwoFactorEnabled(true)
                            setError("Coś poszło nie tak")
                        }
                    })
            })
        }
    }

    const twoFactorCallback = (success: boolean) => {
        setTwoFactorDialogOpened(false)
        if (success) {
            setTwoFactorEnabled(true)
            update()
            setSuccess("Uwierzytelnienie dwuetapowe zostało włączone pomyślnie")
        } else {
            setTwoFactorEnabled(false)
            setError("Coś poszło nie tak")
        }
    }

    const form = useForm<z.infer<typeof ChangePassSchema>>({
        resolver: zodResolver(ChangePassSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
        }
    })

    const onSubmit = (values: z.infer<typeof ChangePassSchema>) => {
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
                        setPasswordEditing(false)
                        form.reset()
                        update()
                    }
                })
                .catch(() => setError("Something went wrong"))
        })
    }
    
    return (
        <div className={styles.content}>
            <div className={styles.header_content}>
                <h1 className={styles.content_title}>Zabezpieczenia</h1>
            </div>

            <div className="mx-5">
                <Dialog
                    open={twoFactorDialogOpened}
                    onOpenChange={setTwoFactorDialogOpened}
                >
                    <DialogContent className='p-0 w-auto bg-transparent border-none' style={{ padding: 0, width: "auto", background: "transparent", border: "none"}}>
                        <TwoFactorForm callback={twoFactorCallback} />
                    </DialogContent>
                </Dialog>

                <div className='mb-4 w-full'>
                    <FormSuccess message={success} />
                    <FormError message={error} />
                </div>

                <div className='flex flex-row mb-4 items-center justify-between rounded-lg border p-3 shadow-sm w-full'>
                    <div className='space-y-0.5'>
                        <p className='font-semibold text-md'>Uwierzytelnienie dwuetapowe (aplikacja)</p>
                        <p className='text-xs'>Aktywuj Uwierzytelnienie dwuetapowe na swoim koncie</p>
                    </div>
                    <Switch 
                        disabled={isPending}
                        checked={twoFactorEnabled}
                        onCheckedChange={(e) => on2faChange(e)}
                    />
                </div>

                <div className='flex flex-col rounded-lg border p-3 shadow-sm w-full'>
                    <div className='flex items-center justify-between'>
                        <div className='space-y-0.5'>
                            <p className='font-semibold text-md'>Zmiana hasła</p>
                            <p className='text-xs'>Tutaj możesz zmienić swoje hasło</p>
                        </div>

                        {passwordEditing ? (
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
                                Zapisz swoje hasło
                            </Button>
                        ) : (
                            <Button 
                                type="button"
                                variant={"outline"} 
                                onClick={() => {
                                    setPasswordEditing(true)
                                }}
                            >
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edytuj swoje hasło
                            </Button>
                        )}
                    </div>

                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6 mt-4'
                        >
                            <div className='space-y-4'>
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Aktualne hasło</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isPending || !passwordEditing} placeholder='******' type='password' autoComplete='current-password' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name='newPassword'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nowe hasło</FormLabel>
                                            <FormControl>
                                                <Input {...field} disabled={isPending || !passwordEditing} placeholder='******' type='password' autoComplete='new-password' />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
