/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { getUploadedFiles, uploadFile } from "@/actions/upload";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Media } from "@prisma/client";
import { ImageIcon, Loader2Icon, UploadCloudIcon } from "lucide-react";
import { createContext, useContext, useState, ReactNode, useRef, useMemo, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Image from "next/image"

interface UploadContextType {
    pickFile: () => Promise<string>;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

const UploadFileSchema = z.object({
    alt: z.string().min(3),
    file: z.instanceof(File),
})

export const UploadProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition()
    const [files, setFiles] = useState<Media[]>([]);
    const fileUrlRef = useRef<string | null>(null);
    const intervalRef = useRef<NodeJS.Timeout>();

    const form = useForm<z.infer<typeof UploadFileSchema>>({
        mode: 'onChange',
        resolver: zodResolver(UploadFileSchema),
        defaultValues: {
            alt: "",
            file: undefined,
        },
    });

    const pickFile = async (): Promise<string> => {
        setOpen(true);
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (fileUrlRef.current) {
                    resolve(fileUrlRef.current);
                    clearInterval(interval);
                    fileUrlRef.current = null;
                }
            }, 500);
            intervalRef.current = interval;
        });
    };

    const handlePickFile = async (url: string) => {
        fileUrlRef.current = url;
        setOpen(false);
    }

    useEffect(() => {
        if (!open && intervalRef.current && fileUrlRef.current === null) {
            clearInterval(intervalRef.current);
        }
        if (open) {
            startTransition(async () => {
                await getUploadedFiles().then((data) => {
                    if (data.files) {
                        setFiles(data.files);
                    } else {
                        setFiles([]);
                    }
                })
            })
        }
    }, [open]);

    const onSubmit = (values: z.infer<typeof UploadFileSchema>) => {
        startTransition(async () => {
            const formData = new FormData()
            const encodedFileName = encodeURIComponent(values.file.name)
            formData.set('file', values.file, encodedFileName)
            formData.set('alt', values.alt)
            await uploadFile(formData)
                .then((data) => {
                    if (data.success) {
                        toast.success('Sukces', { description: data.message });
                        data.url && handlePickFile(data.url);
                        form.reset();
                    } else if (!data.success) {
                        toast.error('Błąd', { description: data.message });
                    } else {
                        toast.error('Błąd', { description: 'Wystąpił nieznany błąd' });
                    }
                })
        })
    };

    return (
        <UploadContext.Provider value={{ pickFile }}>
            {children}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Wybierz zdjęcie</DialogTitle>
                        <DialogDescription>
                            Poniżej możesz wybrać zdjęcie. Możesz albo wybrać z dostępnych albo przesłać nowe.
                        </DialogDescription>
                    </DialogHeader>
                    {/* <div className="grid gap-4 py-4">
                        <Button onClick={() => handlePickFile('https://example.com/img/photo1.jpg')}>Pick photo 1</Button>
                        <Button onClick={() => handlePickFile('https://example.com/img/photo2.jpg')}>Pick photo 2</Button>
                    </div> */}
                    <div className="">
                        <Tabs defaultValue="pick" className="w-full h-[500px]">
                            <TabsList>
                                <TabsTrigger value="pick"><ImageIcon className="w-3 h-3 mr-2" /> Wybierz zdjęcie</TabsTrigger>
                                <TabsTrigger value="upload"><UploadCloudIcon className="w-3 h-3 mr-2" /> Prześlij nowe</TabsTrigger>
                            </TabsList>
                            <TabsContent value="pick" className="h-full">
                                {isPending ? (
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                        {Array.from({ length: 10 }).map((_, i) => (
                                            <Skeleton key={i} className="rounded-md w-full h-[100px]" />
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        {files.length === 0 ? (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <p className="text-md font-medium text-muted-foreground">Brak przesłanych plików</p>
                                            </div>  
                                        ) : (
                                            <div className="grid grid-cols-4 gap-2 mt-3">
                                                {files.map((file) => (
                                                    <div key={file.id} className="rounded-md w-full h-[100px] flex items-center justify-center border cursor-pointer" onClick={() => handlePickFile(file.url)}>
                                                        <Image src={file.url} alt={file.alt} width={file.width} height={file.height} className="object-cover h-[100px] rounded-sm" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </TabsContent>
                            <TabsContent value="upload" className="h-full">
                                <div>
                                    <Form {...form}>
                                        <form
                                            onSubmit={form.handleSubmit(onSubmit)}
                                            className="flex flex-col gap-4"
                                        >
                                            <FormField
                                                disabled={isPending}
                                                control={form.control}
                                                name="alt"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Opis zdjęcia</FormLabel>
                                                        <FormControl>
                                                            <Input 
                                                                {...field}
                                                                placeholder="Opis zdjęcia"
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        {/* <FormMessage /> */}
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                disabled={isPending}
                                                control={form.control}
                                                name="file"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Prześlij plik</FormLabel>
                                                        <FormControl>
                                                            <FileUpload
                                                                accept={['.jpg', '.jpeg', '.png', '.gif']}
                                                                onFileChange={(file) => {
                                                                    form.setValue('file', file);
                                                                }}
                                                            />
                                                        </FormControl>
                                                        {/* <FormMessage /> */}
                                                    </FormItem>
                                                )}
                                            />
                                            <div className='flex items-center w-full gap-2'>
                                                <Button
                                                    className="mt-4 w-40"
                                                    disabled={isPending}
                                                    color='primary'
                                                    type="submit"
                                                >
                                                    {!isPending ? <UploadCloudIcon className='w-4 h-4 mr-2' /> : <Loader2Icon className='w-4 h-4 mr-2' />}
                                                    Prześlij plik
                                                </Button>
                                            </div>
                                        </form>
                                    </Form>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </UploadContext.Provider>
    );
};

export const useUpload = () => {
    const context = useContext(UploadContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
