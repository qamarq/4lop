"use client"

import { upsertElementContent } from '@/actions/manage-page-content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { Loader2Icon, SaveIcon } from 'lucide-react'
import React from 'react'

export default function ConfiguratorBanerForm(props: { configuratorBannerImg: string }) {
    const [configuratorBannerImg, setConfiguratorBannerImg] = React.useState(props.configuratorBannerImg)
    const [isPending, startTransition] = React.useTransition()

    const save = async () => {
        startTransition(async () => {
            await upsertElementContent([
                { elementId: 'configuratorBannerImg', content: configuratorBannerImg },
            ])
            .then(() =>  toast({
                description: "Zaktualizowano treść sekcji Konfigurator - Baner",
            }))
        })
    }
    
    return (
        <div className='flex flex-col space-y-2 w-full'>
            <div className="grid w-full max-w-lg items-center gap-1.5">
                <Label htmlFor="title">Link do zdjęcia</Label>
                <Input type="text" id="title" placeholder="Link do zdjęcia" value={configuratorBannerImg} onChange={(e) => setConfiguratorBannerImg(e.target.value)} />
            </div>

            <Button className='w-full max-w-lg' disabled={isPending} onClick={save}>
                {isPending ? <Loader2Icon className='w-4 h-4 mr-2 animate-spin' /> : <SaveIcon className='w-4 h-4 mr-2' />}
                Zapisz
            </Button>
        </div>
    )
}
