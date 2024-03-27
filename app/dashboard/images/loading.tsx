import React from 'react'
import DashboardTitle from '../_components/Title'
import { Skeleton } from '@/components/ui/skeleton'

export default function loading() {
    return (
        <>
            <DashboardTitle title="Przesłane zdjęcia" />

            <div className='grid grid-cols-5 mt-3 gap-2'>
                {Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className='rounded-md w-full h-[100px]' />
                ))}
            </div>
        </>
    )
}
