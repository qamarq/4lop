"use client"

import { deleteMessage } from '@/actions/contact'
import { Button } from '@/components/ui/button'
import { Loader2Icon, TrashIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function DeleteButton({ messageId }: { messageId: string }) {
    const [isPending, startTransition] = React.useTransition()

    const handleDelete = () => {
        startTransition(async () => {
            await deleteMessage(messageId)
                .then(data => {
                    if (data.success) {
                        toast.success('Wiadomość została usunięta pomyślnie')
                        setTimeout(() => {
                            window.location.href = '/dashboard/contact-form'
                        }, 1000)
                    } else {
                        toast.error('Wystąpił błąd podczas usuwania wiadomości')
                    }
                })
        })
    }

    return (
        <Button disabled={isPending} onClick={handleDelete}>
            {isPending ? <Loader2Icon className='h-3 w-3 mr-1 animate-spin' /> : <TrashIcon className='h-3 w-3 mr-1' />}
            Usuń wiadomość
        </Button>
    )
}
