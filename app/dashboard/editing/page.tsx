import React from 'react'
import { AlignLeftIcon, FootprintsIcon, HelpCircleIcon, HomeIcon, LinkIcon, WorkflowIcon } from 'lucide-react'
import Link from 'next/link'

export default function EditingPage() {
    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Edytuj elementy strony
                </h2>
            </div>

            <div className='mt-4 flex flex-col gap-3'>
                <Link href="/dashboard/editing/home/hero">
                    <div className='flex items-center shadow-sm border-[1px] border-black/10 p-3 rounded-lg cursor-pointer'>
                        <HomeIcon className='w-4 h-4 mr-3' />
                        <h1 className='text-md font-semibold'>Strona główna</h1>
                        <h2 className='text-sm font-medium ml-1'>- Sekcja hero</h2>
                    </div>
                </Link>
                <Link href="/dashboard/editing/home/links">
                    <div className='flex items-center shadow-sm border-[1px] border-black/10 p-3 rounded-lg cursor-pointer'>
                        <LinkIcon className='w-4 h-4 mr-3' />
                        <h1 className='text-md font-semibold'>Strona główna</h1>
                        <h2 className='text-sm font-medium ml-1'>- Szybkie linki</h2>
                    </div>
                </Link>
                <Link href="/dashboard/editing/home/faq">
                    <div className='flex items-center shadow-sm border-[1px] border-black/10 p-3 rounded-lg cursor-pointer'>
                        <HelpCircleIcon className='w-4 h-4 mr-3' />
                        <h1 className='text-md font-semibold'>Strona główna</h1>
                        <h2 className='text-sm font-medium ml-1'>- Pytania i odpowiedzi</h2>
                    </div>
                </Link>
                <Link href="/dashboard/editing/about/content">
                    <div className='flex items-center shadow-sm border-[1px] border-black/10 p-3 rounded-lg cursor-pointer'>
                        <AlignLeftIcon className='w-4 h-4 mr-3' />
                        <h1 className='text-md font-semibold'>O mnie</h1>
                        <h2 className='text-sm font-medium ml-1'>- Treści</h2>
                    </div>
                </Link>
                <Link href="/dashboard/editing/configurator/banner">
                    <div className='flex items-center shadow-sm border-[1px] border-black/10 p-3 rounded-lg cursor-pointer'>
                        <WorkflowIcon className='w-4 h-4 mr-3' />
                        <h1 className='text-md font-semibold'>Konfigurator</h1>
                        <h2 className='text-sm font-medium ml-1'>- Baner</h2>
                    </div>
                </Link>
                <Link href="/dashboard/editing/footer/content">
                    <div className='flex items-center shadow-sm border-[1px] border-black/10 p-3 rounded-lg cursor-pointer'>
                        <FootprintsIcon className='w-4 h-4 mr-3' />
                        <h1 className='text-md font-semibold'>Stopka</h1>
                        <h2 className='text-sm font-medium ml-1'>- Treść</h2>
                    </div>
                </Link>
            </div>
        </>
    )
}
