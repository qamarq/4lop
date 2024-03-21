'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import EditorJS from '@editorjs/editorjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import '@/styles/editor.css';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2Icon, SaveIcon } from 'lucide-react';
import { uploadFile } from '@/actions/upload';

export const postPatchSchema = z.object({
    content: z.any().optional(),
  })

interface EditorProps {
    currentProduct: ProductDB;
    setCurrentProduct: React.Dispatch<React.SetStateAction<ProductDB>>
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type FormData = z.infer<typeof postPatchSchema>;

export function Editor({ currentProduct, setCurrentProduct }: EditorProps) {
    const { register, handleSubmit } = useForm<FormData>({
        resolver: zodResolver(postPatchSchema),
    });
    const ref = React.useRef<EditorJS>();
    const router = useRouter();
    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [isMounted, setIsMounted] = React.useState<boolean>(false);

    const initializeEditor = React.useCallback(async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default;
        const Header = (await import('@editorjs/header')).default;
        const Embed = (await import('@editorjs/embed')).default;
        const Table = (await import('@editorjs/table')).default;
        const List = (await import('@editorjs/list')).default;
        const Code = (await import('@editorjs/code')).default;
        const LinkTool = (await import('@editorjs/link')).default;
        const InlineCode = (await import('@editorjs/inline-code')).default;
        const Image = (await import('@editorjs/image')).default;

        if (!ref.current) {
            const editor = new EditorJS({
                holder: 'editor',
                onReady() {
                    ref.current = editor;
                },
                placeholder: 'Zacznij pisać, aby stworzyć opis produktu...',
                inlineToolbar: true,
                data: currentProduct.description as any,
                tools: {
                    header: Header,
                    linkTool: LinkTool,
                    list: List,
                    code: Code,
                    inlineCode: InlineCode,
                    table: Table,
                    embed: Embed,
                    image: {
                        class: Image,
                        config: {
                            // endpoints: {
                            //     byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
                            //     byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
                            // }
                            // actions: [
                            //     {
                            //         name: 'new_button',
                            //         icon: '<svg>...</svg>',
                            //         title: 'New Button',
                            //         toggle: true,
                            //         action: (name: string) => {
                            //             alert(`${name} button clicked`);
                            //         }
                            //     }
                            // ],
                            uploader: {
                                uploadByFile(file: File) {
                                    const formData = new FormData()
                                    const encodedFileName = encodeURIComponent(file.name)
                                    formData.set('file', file, encodedFileName)
                                    formData.set('alt', "Opis zdjęcia")
                                    return new Promise(async (resolve, reject) => {
                                        await uploadFile(formData)
                                            .then((data) => {
                                                if (data.success) {
                                                    toast.success('Sukces', { description: data.message });
                                                    if (data.url) {
                                                        resolve({
                                                            success: 1,
                                                            file: {
                                                                url: data.url,
                                                            },
                                                        });
                                                    }
                                                } else if (!data.success) {
                                                    toast.error('Błąd', { description: data.message });
                                                    reject(data.message);
                                                } else {
                                                    toast.error('Błąd', { description: 'Wystąpił nieznany błąd' });
                                                    reject('Wystąpił nieznany błąd');
                                                }
                                            })
                                    });
                                
                                }
                            }
                        }
                    }
                },
            });
        }
    }, [currentProduct.description]);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsMounted(true);
        }
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            initializeEditor();

            return () => {
                ref.current?.destroy();
                ref.current = undefined;
            };
        }
    }, [isMounted, initializeEditor]);

    async function onSubmit(data: FormData) {
        setIsSaving(true);

        const blocks = await ref.current?.save();

        await wait(500);
        setCurrentProduct((prev) => ({
            ...prev,
            description: blocks as any,
        }));

        setIsSaving(false);

        return toast.success('Zapisano zmiany');
    }

    if (!isMounted) {
        return null;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full gap-10">
                <div className="prose prose-stone mx-auto w-full dark:prose-invert text-md">
                    {/* <TextareaAutosize
                        autoFocus
                        id="title"
                        defaultValue={post.title}
                        placeholder="Post title"
                        className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
                        {...register('title')}
                    /> */}
                    <div id="editor" className="min-h-[500px]" />
                    <div className='flex items-center justify-between'>
                        <p className="text-sm text-gray-500">
                            Use{' '}
                            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase">
                                Tab
                            </kbd>{' '}
                            to open the command menu.
                        </p>
                        <Button type="submit" className='px-3 py-1' disabled={isSaving}>
                            {isSaving ? (
                                <Loader2Icon className="w-3 h-3 animate-spin" />
                            ) : (
                                <SaveIcon className="w-3 h-3" />
                            )}
                            <span className="ml-2">Zapisz edytor</span>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
