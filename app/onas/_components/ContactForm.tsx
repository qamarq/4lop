"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Captcha from "react-google-recaptcha";
import { Textarea } from '@/components/ui/textarea'
import { ContactSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2Icon, SendIcon } from 'lucide-react'
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { sendContactForm } from '@/actions/contact';
import { toast } from 'sonner';

export default function ContactForm() {
    const captchaRef = useRef<Captcha>(null);
    const [isPending, startTransition] = React.useTransition();
    
    const form = useForm<z.infer<typeof ContactSchema>>({
        resolver: zodResolver(ContactSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            text: '',
        },
    })

    async function onSubmit(values: z.infer<typeof ContactSchema>) {
        const captcha = await captchaRef.current?.executeAsync();

        startTransition(async () => {
            await sendContactForm(values, captcha || '')
                .then(data => {
                    if (data.success) {
                        toast.success('Wiadomość została wysłana pomyślnie!')
                        form.reset()
                        captchaRef.current?.reset()
                    } else {
                        toast.error('Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.')
                    }
                })
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
                {/* <div className="grid w-full items-center gap-1 mb-3">
                    <Label htmlFor="name">Twoje imię</Label>
                    <Input required type="text" id="name" placeholder="Wpisz swoje imię" />
                </div> */}
                <Captcha
                    ref={captchaRef}
                    size="invisible"
                    sitekey={process.env.NEXT_PUBLIC_CAPTCHA!}
                />

                <FormField
                    control={form.control}
                    name="name"
                    disabled={isPending}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Twoje imię</FormLabel>
                            <FormControl>
                                <Input placeholder="Wpisz swoje imię" autoComplete='name' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    disabled={isPending}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adres e-mail</FormLabel>
                            <FormControl>
                                <Input placeholder="Wpisz adres e-mail" autoComplete='email' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    disabled={isPending}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Numer telefonu (opcjonalnie)</FormLabel>
                            <FormControl>
                                <Input placeholder="Wpisz swój numer telefonu" autoComplete='tel' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="text"
                    disabled={isPending}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Treść wiadomości</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Wpisz treść wiadomości" className="resize-none" autoComplete='text' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <Button className="w-[100%]" disabled={!form.formState.isValid || isPending}>
                    {isPending ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <SendIcon className="mr-2 h-4 w-4" />}
                    Wyślij wiadomość
                </Button>
            </form>
        </Form>
    )
}
