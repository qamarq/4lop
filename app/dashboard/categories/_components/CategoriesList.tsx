"use client"

import { deleteCategory } from '@/actions/shop'
import { Loader2Icon, TrashIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function CategoriesList({ categories }: { categories: { id: string, name: string }[] }) {
    const [loadingCategory, setLoadingCategory] = React.useState<string>('')

    const handleDelete = async (id: string) => {
        setLoadingCategory(id)
        await deleteCategory(id)
            .then(data => {
                if (data.error) {
                    toast.error(data.error)
                }

                if (data.success) {
                    toast.success(data.success)
                }
            })
            .finally(() => setLoadingCategory(''))
    }
    return (
        <div className='grid grid-cols-4 gap-2 pr-2'>
            {categories.map((category) => (
                <div key={category.id} className='group relative flex items-center justify-center border rounded-lg px-3 py-1.5 text-md font-medium transition-all'>
                    {loadingCategory === category.id && <Loader2Icon className='w-4 h-4 animate-spin' />}
                    <span>{category.name}</span>
                    <div onClick={() => handleDelete(category.id)} className='absolute inset-0.5 rounded-md bg-black/60 backdrop-blur-sm cursor-pointer hidden group-hover:flex items-center justify-center transition-all'><TrashIcon className='w-4 h-4 text-primary' /></div>
                </div>
            ))}
        </div>
    )
}
