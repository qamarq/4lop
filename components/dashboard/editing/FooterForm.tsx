"use client"

import { upsertElementContent } from '@/actions/manage-page-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Loader2Icon, PlusIcon, SaveIcon, TrashIcon } from 'lucide-react'
import React from 'react'
import { v4 } from 'uuid'

export default function FooterForm(props: { socialMediaFooter: {id: string, label: string, image: string, link: string}[], contactFooter: {id: string, label: string, image: string}[] }) {
    const [socialMediaFooter, setSocialMediaFooter] = React.useState(props.socialMediaFooter)
    const [contactFooter, setContactFooter] = React.useState(props.contactFooter)
    const [isPending, startTransition] = React.useTransition()

    const save = async () => {
        startTransition(async () => {
            await upsertElementContent([
                { elementId: 'socialMediaFooter', content: JSON.stringify(socialMediaFooter) },
                { elementId: 'contactFooter', content: JSON.stringify(contactFooter) }
            ])
            .then(() =>  toast({
                description: "Zaktualizowano treść sekcji Stopka",
            }))
        })
    }
    
    return (
        <div className='flex flex-wrap space-y-2 w-full items-center justify-center gap-2 overflow-y-auto h-full'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 w-full'>
                <div className='shadow-sm border-1 border-black/10 rounded-lg flex flex-col gap-2 p-3 bg-white/80 w-full'>
                    <div className='flex items-center gap-1 mb-2'>
                        <h1 className='text-md font-bold'>Social Media</h1>
                        <Button variant={"ghost"} onClick={() => setSocialMediaFooter([...socialMediaFooter, { id: v4(), label: '', image: '', link: '' }])}><PlusIcon className='w-4 h-4' /></Button>
                    </div>
                    
                    {socialMediaFooter.map((item, index) => (
                        <div className='border-[1px] border-black/30 rounded-md p-3 w-full space-y-2' key={item.id}>
                           <div className='flex items-center mb-1 gap-2'>
                                <h1 className='text-md font-bold'>Link #{index+1}</h1>
                                <Button variant={"ghost"} onClick={() => {
                                    const newContent = [...socialMediaFooter]
                                    newContent.splice(index, 1)
                                    setSocialMediaFooter(newContent)
                                }}><TrashIcon className='w-4 h-4' /></Button>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="title">Treść</Label>
                                <Input type="text" id="title" placeholder="Treść" value={item.label} onChange={(e) => {
                                    const newContent = [...socialMediaFooter]
                                    newContent[index].label = e.target.value
                                    setSocialMediaFooter(newContent)
                                }} />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="link">Link</Label>
                                <Input type="text" id="link" placeholder="Link" value={item.link} onChange={(e) => {
                                    const newContent = [...socialMediaFooter]
                                    newContent[index].link = e.target.value
                                    setSocialMediaFooter(newContent)
                                }} />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="icon">Ikonka</Label>
                                <Input type="text" id="icon" placeholder="Ikonka" value={item.image} onChange={(e) => {
                                    const newContent = [...socialMediaFooter]
                                    newContent[index].image = e.target.value
                                    setSocialMediaFooter(newContent)
                                }} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className='shadow-sm border-1 border-black/10 rounded-lg flex flex-col gap-2 p-3 bg-white/80 w-full overflow-y-auto h-full'>
                <div className='flex items-center gap-1 mb-2'>
                        <h1 className='text-md font-bold'>Kontakt</h1>
                        <Button variant={"ghost"} onClick={() => setContactFooter([...contactFooter, { id: v4(), label: '', image: '' }])}><PlusIcon className='w-4 h-4' /></Button>
                    </div>
                    
                    {contactFooter.map((item, index) => (
                        <div className='border-[1px] border-black/30 rounded-md p-3 w-full space-y-2' key={item.id}>
                           <div className='flex items-center mb-1 gap-2'>
                                <h1 className='text-md font-bold'>Treść #{index+1}</h1>
                                <Button variant={"ghost"} onClick={() => {
                                    const newContent = [...contactFooter]
                                    newContent.splice(index, 1)
                                    setContactFooter(newContent)
                                }}><TrashIcon className='w-4 h-4' /></Button>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="title">Treść</Label>
                                <Input type="text" id="title" placeholder="Treść" value={item.label} onChange={(e) => {
                                    const newContent = [...contactFooter]
                                    newContent[index].label = e.target.value
                                    setContactFooter(newContent)
                                }} />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="icon">Ikonka</Label>
                                <Input type="text" id="icon" placeholder="Ikonka" value={item.image} onChange={(e) => {
                                    const newContent = [...contactFooter]
                                    newContent[index].image = e.target.value
                                    setContactFooter(newContent)
                                }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            

            <Button className='w-full' disabled={isPending} onClick={save}>
                {isPending ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <SaveIcon className='w-4 h-4 mr-2' />}
                Zapisz
            </Button>
        </div>
    )
}
