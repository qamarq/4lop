"use client"

import { upsertElementContent } from '@/actions/manage-page-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Loader2Icon, SaveIcon } from 'lucide-react'
import React from 'react'

export default function HeroForm(props: { heroTitle: string, heroSubtitle: string, heroButtonText: string, heroButtonLink: string }) {
    const [heroTitle, setHeroTitle] = React.useState(props.heroTitle)
    const [heroSubtitle, setHeroSubtitle] = React.useState(props.heroSubtitle)
    const [heroButtonText, setHeroButtonText] = React.useState(props.heroButtonText)
    const [heroButtonLink, setHeroButtonLink] = React.useState(props.heroButtonLink)
    const [isPending, startTransition] = React.useTransition()

    const save = async () => {
        startTransition(async () => {
            await upsertElementContent([
                { elementId: 'heroTitle', content: heroTitle },
                { elementId: 'heroSubtitle', content: heroSubtitle },
                { elementId: 'heroButtonText', content: heroButtonText },
                { elementId: 'heroButtonLink', content: heroButtonLink }
            ])
            .then(() =>  toast({
                description: "Zaktualizowano treść sekcji Hero",
            }))
        })
    }
    
    return (
        <div className='flex flex-col space-y-2 w-full'>
            <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="title">Tytuł</Label>
                <Input type="text" id="title" placeholder="Tytuł" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
            </div>
            <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="subtitle">Podtytuł</Label>
                <Input type="text" id="subtitle" placeholder="Podtytuł" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
            </div>
            <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="button_text">Tekst przycisku</Label>
                <Input type="text" id="button_text" placeholder="Tekst przycisku" value={heroButtonText} onChange={(e) => setHeroButtonText(e.target.value)} />
            </div>
            <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="button_link">Link przycisku</Label>
                <Input type="text" id="button_link" placeholder="Link przycisku" value={heroButtonLink} onChange={(e) => setHeroButtonLink(e.target.value)} />
            </div>

            <Button className='w-full max-w-lg' disabled={isPending} onClick={save}>
                {isPending ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <SaveIcon className='w-4 h-4 mr-2' />}
                Zapisz
            </Button>
        </div>
    )
}
