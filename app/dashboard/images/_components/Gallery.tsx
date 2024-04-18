"use client"

import { Media } from '@prisma/client'
import React from 'react'
import Image from 'next/image'
import { ClipboardIcon, PlusIcon, TrashIcon, ZoomInIcon } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { deleteFile, revalidateFiles } from '@/actions/upload'
import { toast } from 'sonner'
import { useUpload } from '@/hooks/use-upload'

export default function Gallery({ files }: { files: Media[] }) {
    const { pickFile } = useUpload()

    const handleDelete = async (id: string) => {
        await deleteFile(id)
            .then(data => {
                if (data.success) {
                    toast.success(data.message)
                } else {
                    toast.error(data.message)
                }
            })
    }

    const handleUpload = () => {
        pickFile(true).then(async () => {
            await revalidateFiles()
        });
    }

    return (
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mt-3 gap-2'>
            {files.map((file) => {
                const url = `${process.env.NEXTAUTH_URL}${file.url}`
                const urlSecond = `${process.env.NEXTAUTH_URL}${file.urlSecond}`

                const handleCopy = async (url: string) => {
                    await navigator.clipboard.writeText(url)
                        .then(() => {
                            toast.success("Skopiowano link do schowka")
                        })
                        .catch(() => {
                            toast.error("Błąd podczas kopiowania linku")
                        })
                }

                return (
                    <Dialog key={file.id}>
                        <DialogTrigger asChild>
                            <div className="group relative rounded-md w-full aspect-square flex items-center justify-center border cursor-pointer overflow-hidden transition-all">
                                <Image src={file.url} alt={file.alt} width={file.width} height={file.height} className="overflow-hidden object-cover h-full rounded-sm group-hover:h-auto transition-all" />
                                <div className='absolute inset-[0] rounded-sm hidden group-hover:flex items-center justify-center backdrop-blur-sm bg-black/50'>
                                    <ZoomInIcon className='h-6 w-6 text-white' />
                                </div>
                            </div>
                        </DialogTrigger>
                        <DialogContent className='w-full max-w-[1200px]'>
                            <div className='w-full flex flex-col md:flex-row'>
                                <div className='w-1/2 aspect-square flex items-center justify-center'>
                                    <Image src={file.url} alt={file.alt} width={file.width} height={file.height} className="overflow-hidden object-cover w-full rounded-lg" />
                                </div>
                                <div className='w-1/2 m-2 p-4 flex flex-col space-y-4 h-full'>
                                    <div className='flex items-center justify-between text-md'>
                                        <p>Opis zdjęcia</p>
                                        <h1 className='font-semibold'>{file.alt || "Brak opisu"}</h1>
                                    </div>
                                    <div className='flex items-center justify-between text-md'>
                                        <p>Data przesłania</p>
                                        <h1 className='font-semibold'>{format(file.createdAt, "dd.MM.yyyy HH:MM")}</h1>
                                    </div>
                                    <div className='flex items-center justify-between text-md'>
                                        <p>Typ zdjęcia</p>
                                        <h1 className='font-semibold'>{file.type}</h1>
                                    </div>
                                    <div className='flex items-center justify-between text-md'>
                                        <p>Wymiary</p>
                                        <h1 className='font-semibold'>{file.width}x{file.height}px</h1>
                                    </div>
                                    <hr className='!my-6' />
                                    <div className='flex flex-col space-y-1'>
                                        <div className='flex items-center justify-between text-md'>
                                            <div className='flex items-center gap-1'>
                                                <p>Zdjęcie oryginalne</p>
                                                <div className='border text-xs px-2 py-0.5 rounded-sm bg-emerald-500 text-white font-semibold'>Najlepsza jakość</div>
                                            </div>
                                            <button className='w-[34px] aspect-square flex items-center justify-center bg-primary rounded-sm text-white cursor-pointer focus:outline-none' onClick={() => handleCopy(url)}>
                                                <ClipboardIcon className='h-4 w-4' />
                                            </button>
                                        </div>
                                        <Link className='text-sm font-semibold text-blue-600' href={url}>{url}</Link>
                                    </div>
                                    <div className='flex flex-col space-y-1 !mt-5'>
                                        <div className='flex items-center justify-between text-md'>
                                            <div className='flex items-center gap-1'>
                                                <p>Zdjęcie skompresowane</p>
                                                <div className='border text-xs px-2 py-0.5 rounded-sm bg-sky-500 text-white font-semibold'>Najmniejszy rozmiar</div>
                                            </div>
                                            <button className='w-[34px] aspect-square flex items-center justify-center bg-primary rounded-sm text-white cursor-pointer focus:outline-none' onClick={() => handleCopy(urlSecond)}>
                                                <ClipboardIcon className='h-4 w-4' />
                                            </button>
                                        </div>
                                        <Link className='text-sm font-semibold text-blue-600' href={urlSecond}>{urlSecond}</Link>
                                    </div>
    
                                    <div className='grow flex items-end justify-end'>
                                        <div className='flex items-center gap-1'>
                                            <DialogClose asChild onClick={() => handleDelete(file.id)}><Button variant={"outline"}><TrashIcon className='w-3 h-3 mr-2' /> Usuń zdjęcie</Button></DialogClose>
                                            <DialogClose asChild><Button>Zamknij</Button></DialogClose>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            })}

            <div className="rounded-md w-full aspect-square flex items-center justify-center border cursor-pointer text-primary" onClick={handleUpload}>
                <PlusIcon size={50} />
            </div>
        </div>
    )
}
