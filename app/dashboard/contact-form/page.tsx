import React from 'react'
import DashboardTitle from '../_components/Title'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { format } from 'date-fns'

export default async function ContactFormPage() {
    const messages = await prisma.contactForm.findMany({ orderBy: { createdAt: 'desc' } })

    return (
        <>
            <DashboardTitle title="Formularz kontaktowy" />

            <div className='flex flex-col mt-3 space-y-2'>
                {messages.map((message, index) => (
                    <Link key={message.id} href={'/dashboard/contact-form/'+message.id} className='border rounded-md shadow-sm bg-white p-3 cursor-pointer'>
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col text-sm'>
                                <h3 className='font-semibold'>{message.name}</h3>
                                <span className='text-xs'>{message.email}</span>
                            </div>

                            <div className='flex items-center gap-1 text-sm'>
                                <p className='font-semibold text-xs'>{format(message.createdAt, "dd.MM.yyyy - HH:mm")} | </p>
                                {message.read === 'false' ? (
                                    <div className='bg-rose-500 py-1 px-3 rounded-full text-white font-semibold text-xs'>Nowa</div>
                                ) : (
                                    <div className='bg-emerald-500 py-1 px-3 rounded-full text-white font-semibold text-xs'>Przeczytana</div>
                                )}
                            </div>
                        </div>
                    </Link>  
                ))}
            </div>
        </>
    )
}
