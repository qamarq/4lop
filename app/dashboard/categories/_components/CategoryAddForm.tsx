"use client"

import { addCategory } from '@/actions/shop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2Icon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

export default function CategoryAddForm() {
    const [category, setCategory] = React.useState('')
    const [isPending, startTransition] = React.useTransition()

    const handleSubmit = () => {
        startTransition(async () => {
            await addCategory(category)
                .then(data => {
                    if (data.error) {
                        toast.error(data.error)
                    }

                    if (data.success) {
                        toast.success(data.success)
                        setCategory('')
                    }
                })
        })
    }

    return (
        <div className='pr-1'>
            <div className='flex items-center justify-between space-y-2'>
                <h2 className='text-xl font-bold tracking-tight'>
                    Dodaj nową kategorię
                </h2>
            </div>
            <div className='space-y-3 mt-3'>
                <div className='space-y-4'>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="category">Nazwa kategorii</Label>
                        <Input type="text" id="category" placeholder="Wpisz kategorię" value={category} onChange={(e) => setCategory(e.target.value)} disabled={isPending} />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button disabled={isPending} onClick={handleSubmit}>{isPending && <Loader2Icon className='w-3 h-3 mr-2 animate-spin' />} Dodaj kategorię</Button>
                </div>
            </div>
        </div>
    )
}
