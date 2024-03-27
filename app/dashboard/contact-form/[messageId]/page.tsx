import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import React from 'react'
import DashboardTitle from '../../_components/Title'
import { format } from 'date-fns'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import DeleteButton from './_component/DeleteButton'

export default async function MessageDetails({ params }: { params: { messageId: string } }) {
    const messageDetails = await prisma.contactForm.findUnique({ where: { id: params.messageId } })
    if (!messageDetails) { return notFound() }

    if (messageDetails.read === 'false') {
        const user = await currentUser()
        await prisma.contactForm.update({ where: { id: params.messageId }, data: { read: 'true', read_by: user?.id } })
        revalidatePath('/dashboard/contact-form/')
    }

    return (
        <>
            <div className='flex items-start justify-between'>
                <div className='flex gap-2'>
                    <Link href="/dashboard/contact-form">
                        <Button variant={"outline"} size={"icon"} className='mt-1'><ChevronLeft /></Button>
                    </Link>
                    <div>
                        <DashboardTitle title={messageDetails.name} />
                        <p className='text-sm'>E-mail: <span className='font-semibold'>{messageDetails.email}</span></p>
                        <p className='text-sm'>Telefon: <span className='font-semibold'>{messageDetails.phone || "Brak"}</span></p>
                        <p className='text-sm'>Przesłano: <span className='font-semibold'>{format(messageDetails.createdAt, "dd.MM.yyyy - HH:mm:ss")}</span></p>
                        <p className='text-sm mt-2'>Treść wiadomości: <span className='font-semibold'>{messageDetails.message}</span></p>
                    </div>
                </div>

                <div className='flex items-center gap-1 mt-1'>
                    <DeleteButton messageId={messageDetails.id} />
                </div>
            </div>
        </>
    )
}
