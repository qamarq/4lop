"use client"

import { upsertElementContent } from '@/actions/manage-page-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { Loader2Icon, PlusIcon, SaveIcon, TrashIcon } from 'lucide-react'
import React from 'react'
import { v4 } from 'uuid'

export default function AboutForm(props: { aboutContent: {id: string, title: string, content: string, image: string, icon: string}[] }) {
    const [aboutContent, setAboutContent] = React.useState(props.aboutContent)
    const [isPending, startTransition] = React.useTransition()

    const save = async () => {
        startTransition(async () => {
            await upsertElementContent([
                { elementId: 'aboutContent', content: JSON.stringify(aboutContent) },
            ])
            .then(() =>  toast({
                description: "Zaktualizowano treść sekcji Stopka",
            }))
        })
    }
    
    return (
        <div className='flex flex-wrap space-y-2 w-full items-center justify-center gap-2 overflow-y-auto h-full'>
            <div className='w-full'>
                <div className='shadow-sm border-1 border-black/10 rounded-lg flex flex-col gap-2 p-3 bg-white/80 w-full'>
                    <div className='flex items-center gap-1 mb-2'>
                        <h1 className='text-md font-bold'>Treść strony &quot;O nas&quot;</h1>
                        <Button variant={"ghost"} onClick={() => setAboutContent([...aboutContent, { id: v4(), title: '', content: '', image: 'https://placehold.co/1200x700', icon: 'https://placehold.co/30x30' }])}><PlusIcon className='w-4 h-4' /></Button>
                    </div>
                    
                    {aboutContent.map((item, index) => (
                        <div className='border-[1px] border-black/30 rounded-md p-3 w-full space-y-2' key={item.id}>
                           <div className='flex items-center mb-1 gap-2'>
                                <h1 className='text-md font-bold'>Karta #{index+1}</h1>
                                <Button variant={"ghost"} onClick={() => {
                                    const newContent = [...aboutContent]
                                    newContent.splice(index, 1)
                                    setAboutContent(newContent)
                                }}><TrashIcon className='w-4 h-4' /></Button>
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="title">Tytuł</Label>
                                <Input type="text" id="title" placeholder="Tytuł" value={item.title} onChange={(e) => {
                                    const newContent = [...aboutContent]
                                    newContent[index].title = e.target.value
                                    setAboutContent(newContent)
                                }} />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="content">Treść</Label>
                                <Textarea id="content" placeholder="Treść" value={item.content} onChange={(e) => {
                                    const newContent = [...aboutContent]
                                    newContent[index].content = e.target.value
                                    setAboutContent(newContent)
                                }} />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="icon">Ikonka</Label>
                                <Input type="text" id="icon" placeholder="Ikonka" value={item.icon} onChange={(e) => {
                                    const newContent = [...aboutContent]
                                    newContent[index].icon = e.target.value
                                    setAboutContent(newContent)
                                }} />
                            </div>
                            <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="image">Zdjęcie</Label>
                                <Input type="text" id="image" placeholder="Zdjęcie" value={item.image} onChange={(e) => {
                                    const newContent = [...aboutContent]
                                    newContent[index].image = e.target.value
                                    setAboutContent(newContent)
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
