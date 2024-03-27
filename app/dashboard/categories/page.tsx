import { prisma } from '@/lib/db'
import React from 'react'
import CategoryAddForm from './_components/CategoryAddForm'
import CategoriesList from './_components/CategoriesList'
import DashboardTitle from '../_components/Title'

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany()
    
    return (
        <>
            <DashboardTitle title="Edytuj kategorie" />

            <div className='flex mt-3'>
                <div className="grow">
                    <CategoriesList categories={categories} />
                </div>
                <div className="border-l w-1/3 pl-4">
                    <CategoryAddForm />
                </div>
            </div>
        </>
    )
}
