import React from 'react'
import DashboardTitle from '../_components/Title'
import Gallery from './_components/Gallery'
import { prisma } from '@/lib/db'

export default async function ImagesPage() {
    const files = await prisma.media.findMany()
    return (
        <>
            <DashboardTitle title="Przesłane zdjęcia" />

            <Gallery files={files} />
        </>
    )
}
