"use client"

import { upsertElementContent } from '@/actions/manage-page-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Loader2Icon, SaveIcon } from 'lucide-react'
import React from 'react'

export default function LinksForm(props: { firstBanner: {title: string, image: string, link: string}, secondBanner: {title: string, image: string, link: string}, thirdBanner: {title: string, image: string, link: string} }) {
    const [firstBanner, setFirstBanner] = React.useState(props.firstBanner)
    const [secondBanner, setSecondBanner] = React.useState(props.secondBanner)
    const [thirdBanner, setThirdBanner] = React.useState(props.thirdBanner)
    const [isPending, startTransition] = React.useTransition()

    const save = async () => {
        startTransition(async () => {
            await upsertElementContent([
                { elementId: 'linkFirstBanner', content: JSON.stringify(firstBanner) },
                { elementId: 'linkSecondBanner', content: JSON.stringify(secondBanner) },
                { elementId: 'linkThirdBanner', content: JSON.stringify(thirdBanner) }
            ])
            .then(() =>  toast({
                description: "Zaktualizowano treść sekcji Szybkie linki",
            }))
        })
    }
    
    return (
        <div className='flex flex-wrap space-y-2 w-full items-center justify-center gap-2'>
            <div className='shadow-sm border-1 border-black/10 rounded-lg flex flex-col gap-2 p-3 bg-white/80'>
                <h1 className='text-md font-bold mb-2'>Pierwszy baner</h1>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="first_banner_title">Tytuł</Label>
                    <Input type="text" id="first_banner_title" placeholder="Tytuł" value={firstBanner.title} onChange={(e) => setFirstBanner(prev => ({...prev, title: e.target.value}))} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="first_banner_image">Zdjęcie</Label>
                    <Input type="text" id="first_banner_image" placeholder="Zdjęcie" value={firstBanner.image} onChange={(e) => setFirstBanner(prev => ({...prev, image: e.target.value}))} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="first_banner_link">Link</Label>
                    <Input type="text" id="first_banner_link" placeholder="Link" value={firstBanner.link} onChange={(e) => setFirstBanner(prev => ({...prev, link: e.target.value}))} />
                </div>
            </div>
            
            <div className='shadow-sm border-1 border-black/10 rounded-lg flex flex-col gap-2 p-3 bg-white/80'>
                <h1 className='text-md font-bold mb-2'>Drugi baner</h1>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="second_banner_title">Tytuł</Label>
                    <Input type="text" id="second_banner_title" placeholder="Tytuł" value={secondBanner.title} onChange={(e) => setSecondBanner(prev => ({...prev, title: e.target.value}))} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="second_banner_image">Zdjęcie</Label>
                    <Input type="text" id="second_banner_image" placeholder="Zdjęcie" value={secondBanner.image} onChange={(e) => setSecondBanner(prev => ({...prev, image: e.target.value}))} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="second_banner_link">Link</Label>
                    <Input type="text" id="second_banner_link" placeholder="Link" value={secondBanner.link} onChange={(e) => setSecondBanner(prev => ({...prev, link: e.target.value}))} />
                </div>
            </div>

            <div className='shadow-sm border-1 border-black/10 rounded-lg flex flex-col gap-2 p-3 bg-white/80'>
                <h1 className='text-md font-bold mb-2'>Trzeci baner</h1>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="third_banner_title">Tytuł</Label>
                    <Input type="text" id="third_banner_title" placeholder="Tytuł" value={thirdBanner.title} onChange={(e) => setThirdBanner(prev => ({...prev, title: e.target.value}))} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="third_banner_image">Zdjęcie</Label>
                    <Input type="text" id="third_banner_image" placeholder="Zdjęcie" value={thirdBanner.image} onChange={(e) => setThirdBanner(prev => ({...prev, image: e.target.value}))} />
                </div>
                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="third_banner_link">Link</Label>
                    <Input type="text" id="third_banner_link" placeholder="Link" value={thirdBanner.link} onChange={(e) => setThirdBanner(prev => ({...prev, link: e.target.value}))} />
                </div>
            </div>

            <Button className='w-full' disabled={isPending} onClick={save}>
                {isPending ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <SaveIcon className='w-4 h-4 mr-2' />}
                Zapisz
            </Button>
        </div>
    )
}
