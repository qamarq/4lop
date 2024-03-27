"use client"

import { addGroup, deleteGroup, editGroup } from '@/actions/shop'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Group } from '@prisma/client'
import { Reorder, useDragControls } from 'framer-motion'
import { ChevronRightIcon, GripVerticalIcon, Loader2Icon, PlusIcon, SaveIcon, TrashIcon } from 'lucide-react'
import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { toast } from 'sonner'
import { v4 } from 'uuid'

const defaultGroupState = {
    name: '',
    variants: [],
    id: ''
}

export default function GroupsPageComponent({ groups }: { groups: Group[] }) {
    const [selectedGroup, setSelectedGroup] = React.useState<{id: string, name: string, variants: {id: string, value: string}[]}>(defaultGroupState)
    const [isPending, startTransition] = React.useTransition()
    
    const preparedGroups = useMemo(() => {
        return groups.map(group => ({
            ...group,
            variants: group.variants.map((v) => ({ id: v4(), value: v }))
        }))
    }, [groups])

    const isReady = useMemo(() => {
        return selectedGroup.name.length > 0 && selectedGroup.variants.length > 0
    }, [selectedGroup])

    const handleAddOrEdit = async () => {
        const preparedGroup = {
            id: selectedGroup.id,
            name: selectedGroup.name,
            variants: selectedGroup.variants.map(v => v.value)
        }
        if (selectedGroup.id === "") {
            startTransition(async () => {
                await addGroup(preparedGroup.name, preparedGroup.variants)
                    .then(data => {
                        if (data.error) toast.error(data.error)
                        else if (data.success) {
                            toast.success(data.success)
                            setSelectedGroup(defaultGroupState)
                        }
                    })
            })
        } else {
            startTransition(async () => {
                await editGroup(preparedGroup.id, preparedGroup.name, preparedGroup.variants)
                    .then(data => {
                        if (data.error) toast.error(data.error)
                        else if (data.success) {
                            toast.success(data.success)
                            setSelectedGroup(defaultGroupState)
                        }
                    })
            })
        }
    }

    const handleDeleteGroup = (id: string) => {
        startTransition(async () => {
            await deleteGroup(id)
                .then(data => {
                    if (data.error) toast.error(data.error)
                    else if (data.success) {
                        toast.success(data.success)
                        setSelectedGroup(defaultGroupState)
                    }
                })
        })
    }

    return (
        <div className='flex mt-3'>
            <div className="grow pr-4 space-y-2">
                {preparedGroups.map(group => (
                    <div key={group.id} className='border w-full rounded-lg py-2 px-3 text-md font-medium bg-white cursor-pointer flex items-center justify-between' onClick={() => setSelectedGroup(group)}>
                        <div>
                            <h1>{group.name}</h1>
                            <p className='text-xs text-muted-foreground'>{group.variants.map(v => v.value).join(", ")}</p>
                        </div>
                        <ChevronRightIcon className='w-4 h-4' />
                    </div>
                ))}
                <div className={cn('border w-full rounded-lg py-2 px-3 text-md font-medium bg-white cursor-pointer flex items-center justify-center text-primary', { 'pointer-events-none grayscale': selectedGroup.id === "" })}>
                    <PlusIcon className='w-4 h-4' />
                </div>
            </div>
            <div className='border-l w-1/3 pl-4'>
                <div className='flex items-center justify-between space-y-2'>
                    <h2 className='text-xl font-bold tracking-tight'>
                        Dodaj nową grupę
                    </h2>
                </div>

                <div className='space-y-3 mt-3'>
                    <div className='space-y-4 pr-1'>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="group">Nazwa grupy</Label>
                            <Input type="text" autoComplete='off' id="group" value={selectedGroup.name} onChange={(e) => setSelectedGroup(prev => ({ ...prev, name: e.target.value }))} placeholder="Wpisz grupę" />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="versions">Warianty</Label>

                            <div className='w-full space-y-2'>
                                <Reorder.Group axis="y" values={selectedGroup.variants} onReorder={(items) => setSelectedGroup(prev => ({ ...prev, variants: items }))} className='space-y-1'>
                                    {selectedGroup.variants.map((variant, index) => (
                                        <Item key={variant.id} id={variant.id} variant={variant} setSelectedGroup={setSelectedGroup} />
                                    ))}
                                </Reorder.Group>

                                <div className='rounded-lg cursor-pointer border p-2 shadow-sm w-full overflow-y-auto bg-white flex items-center justify-center text-primary' onClick={() => setSelectedGroup(prev => ({ ...prev, variants: [ ...prev.variants, { id: v4(), value: "nowy"}] })) }>
                                    <PlusIcon className='w-4 h-4' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between pr-1'>
                        <Button onClick={() => handleDeleteGroup(selectedGroup.id)} disabled={selectedGroup.id === "" || isPending} variant={"outline"}>Usuń</Button>
                        <Button onClick={handleAddOrEdit} disabled={!isReady || isPending}>{isPending ? <Loader2Icon className='w-3 h-3 mr-1 animate-spin' /> : <SaveIcon className='w-3 h-3 mr-1' />} {selectedGroup.id === "" ? "Dodaj grupę" : "Zapisz grupę"}</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Item = ({ id, variant, setSelectedGroup }: { id: string, variant: {id: string, value: string}, setSelectedGroup: Dispatch<SetStateAction<{ id: string; name: string; variants: { id: string; value: string; }[]; }>> }) => {
    const dragControls = useDragControls();
    
    return (
        <Reorder.Item value={variant} dragListener={false} dragControls={dragControls}>
            <div className='rounded-lg border p-2 shadow-sm w-full overflow-y-auto bg-white flex items-center select-none'>
                <input autoComplete='off' value={variant.value} className='w-full focus:outline-none text-sm' onChange={(e) => {
                    const value = e.target.value
                    setSelectedGroup(prev => ({
                        ...prev,
                        variants: prev.variants.map((v) => v.id === id ? { id: v.id, value: value } : v)
                    }))
                }} />
                <div className='flex items-center gap-1'>
                    <div className='flex items-center justify-center p-1 cursor-pointer' onClick={() => { setSelectedGroup(prev => ({ ...prev, variants: prev.variants.filter(v => v.id !== id) })) }}>
                        <TrashIcon className='w-4 h-4' />
                    </div>
                    <div className='flex items-center justify-center p-1 cursor-grab' onPointerDown={(event) => dragControls.start(event)}>
                        <GripVerticalIcon className='w-4 h-4' />
                    </div>
                </div>
            </div>
        </Reorder.Item>
    )
}