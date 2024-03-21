/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { CheckCircle2Icon, CheckIcon, ChevronDown, ChevronUp, ChevronsUpDownIcon, ImageIcon, ImportIcon, Loader2Icon, PlusIcon, SaveIcon, ScanSearchIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { set } from 'zod';
import { AnimatePresence, motion } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import StepperComponent from '@/components/stepper';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createOrUpdateProduct, getAllProducts, getCategories, getProduct, getProductByIdAdmin, getProductGroups } from '@/actions/products';
import { toast } from "sonner"
import { useUpload } from '@/hooks/use-upload';
import { getUploadedFileByURL } from '@/actions/upload';
import { Editor } from '@/components/editor';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardProductsPage() {
    const [products, setProducts] = React.useState<{ label: string; value: string; status: string; image: string; }[]>([]);
    const [open, setOpen] = React.useState(false);
    const productIdInputRef = React.useRef<HTMLInputElement>(null);
    const [enableGroup, setEnableGroup] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isPendingFetching, startTransitionFetching] = React.useTransition()

    const [categories, setCategories] = React.useState<{id: string, name: string}[]>([]);
    const [productGroups, setProductGroups] = React.useState<{id: string, name: string, variants: string[]}[]>([]);

    const { pickFile } = useUpload();
    const [selectedProduct, setSelectedProduct] = React.useState<{
        label: string;
        value: string;
        status: string;
        image: string;
    } | null>(null);
    const [currentProduct, setCurrentProduct] = React.useState<ProductDB>({
        id: null,
        name: "",
        iconImage: "",
        categoryId: "",
        type: "product",
        price: "0",
        taxPercent: 23,
        discount: 0,
        shortDescription: "",
        description: null,
        group: "",
        variant: "",
        amount: 0,
        sellBy: 1,
        unit: "szt.",
        unitFraction: "sztuka",
        shippingToday: false,
        available: true,
        availabilityDesc: "",
        images: [],
        status: "draft",
    });
    const firstTimeRef = React.useRef(true);

    const fetchAllProducts = async () => {
        startTransitionFetching(async () => {
            await getAllProducts().then((data) => {
                if (data) {
                    setProducts(data.map(product => { return {label: product.name, value: product.id, status: "live", image: product.iconImage } }))
                }
            })
        })
    }

    useEffect(() => {
        const fetchCategories = async () => {
            await getCategories().then((data) => {
                if (data.success) {
                    setCategories(data.categories)
                }
            })
        }

        const fetchProductGroups = async () => {
            await getProductGroups().then((data) => {
                if (data.success) {
                    setProductGroups(data.groups)
                }
            })
        }

        if (firstTimeRef.current) {
            fetchCategories();
            fetchProductGroups();
            fetchAllProducts()

            firstTimeRef.current = false;
            return;
        }
    }, [])

    const [isOpenGeneralInfo, setOpenGeneralInfo] = React.useState(true);
    const [isOpenVariant, setOpenVariant] = React.useState(false);
    const [isOpenDescription, setOpenDescription] = React.useState(false);
    const [isOpenStock, setOpenStock] = React.useState(false);
    const [isOpenImages, setOpenImages] = React.useState(false);

    const toggleGeneralInfo = () => {
        setOpenGeneralInfo(!isOpenGeneralInfo);
        setOpenVariant(false);
        setOpenDescription(false);
        setOpenStock(false);
        setOpenImages(false);
    }
    const toggleVariant = () => {
        setOpenVariant(!isOpenVariant);
        setOpenGeneralInfo(false);
        setOpenDescription(false);
        setOpenStock(false);
        setOpenImages(false);
    }
    const toggleDescription = () => {
        setOpenDescription(!isOpenDescription);
        setOpenGeneralInfo(false);
        setOpenVariant(false);
        setOpenStock(false);
        setOpenImages(false);
    }
    const toggleStock = () => {
        setOpenStock(!isOpenStock);
        setOpenGeneralInfo(false);
        setOpenVariant(false);
        setOpenDescription(false);
        setOpenImages(false);
    }
    const toggleImages = () => {
        setOpenImages(!isOpenImages);
        setOpenGeneralInfo(false);
        setOpenVariant(false);
        setOpenDescription(false);
        setOpenStock(false);
    }

    const isGeneralInfoTitleCompleted = useMemo(() => { return currentProduct.name !== "" && currentProduct.name.length > 0; }, [currentProduct.name]);
    const isGeneralInfoShortDescriptionCompleted = useMemo(() => { return currentProduct.shortDescription !== "" && currentProduct.shortDescription.length > 0; }, [currentProduct.shortDescription]);
    const isGeneralInfoPriceCompleted = useMemo(() => { return typeof currentProduct.price === "string" && currentProduct.price !== "0"; }, [currentProduct.price]);
    const isGeneralInfoDiscountCompleted = useMemo(() => { return typeof currentProduct.discount === "number" && currentProduct.discount >= 0; }, [currentProduct.discount]);
    const isGeneralInfoTaxCompleted = useMemo(() => { return typeof currentProduct.taxPercent === "number" && currentProduct.taxPercent > 0; }, [currentProduct.taxPercent]);
    const isGeneralInfoCategoryCompleted = useMemo(() => { return currentProduct.categoryId !== ""; }, [currentProduct.categoryId]);
    const isGeneralInfoTypeCompleted = useMemo(() => { return currentProduct.type !== ""; }, [currentProduct.type]);

    const isGeneralInfoStepCompleted = useMemo(() => {
        const isComplete = isGeneralInfoTitleCompleted && isGeneralInfoShortDescriptionCompleted && isGeneralInfoPriceCompleted && isGeneralInfoDiscountCompleted && isGeneralInfoTaxCompleted && isGeneralInfoCategoryCompleted && isGeneralInfoTypeCompleted;
        // if (isComplete) { setOpenGeneralInfo(false); setOpenVariant(true);}
        return isComplete;
    }, [isGeneralInfoCategoryCompleted, isGeneralInfoDiscountCompleted, isGeneralInfoPriceCompleted, isGeneralInfoShortDescriptionCompleted, isGeneralInfoTaxCompleted, isGeneralInfoTitleCompleted, isGeneralInfoTypeCompleted]);

    const generalInfoStepsCompletedCount = useMemo(() => {
        return [isGeneralInfoTitleCompleted, isGeneralInfoShortDescriptionCompleted, isGeneralInfoPriceCompleted, isGeneralInfoDiscountCompleted, isGeneralInfoTaxCompleted, isGeneralInfoCategoryCompleted, isGeneralInfoTypeCompleted].filter((step) => step).length;
    }, [isGeneralInfoCategoryCompleted, isGeneralInfoDiscountCompleted, isGeneralInfoPriceCompleted, isGeneralInfoShortDescriptionCompleted, isGeneralInfoTaxCompleted, isGeneralInfoTitleCompleted, isGeneralInfoTypeCompleted]);



    const isVariantGroupCompleted = useMemo(() => { return currentProduct.group !== ""; }, [currentProduct.group]);
    const isVariantVariantCompleted = useMemo(() => { return currentProduct.variant !== ""; }, [currentProduct.variant]);

    const isVariantStepCompleted = useMemo(() => {
        const isComplete = enableGroup ? (isVariantGroupCompleted && isVariantVariantCompleted) : true;
        // if (isComplete) { setOpenVariant(false); setOpenStock(true);}
        return isComplete;
    }, [enableGroup, isVariantGroupCompleted, isVariantVariantCompleted]);

    const variantStepsCompletedCount = useMemo(() => {
        return [isVariantGroupCompleted, isVariantVariantCompleted].filter((step) => step).length;
    }, [isVariantGroupCompleted, isVariantVariantCompleted]);



    const isStockAvailableCompleted = useMemo(() => { return currentProduct.amount >= 0; }, [currentProduct.amount]);
    const isStockSellByCompleted = useMemo(() => { return currentProduct.sellBy > 0; }, [currentProduct.sellBy]);
    const isStockUnitCompleted = useMemo(() => { return currentProduct.unit !== ""; }, [currentProduct.unit]);
    const isStockUnitFractionCompleted = useMemo(() => { return currentProduct.unitFraction !== ""; }, [currentProduct.unitFraction]);
    const isStockAvailabilityDescCompleted = true

    const isStockStepCompleted = useMemo(() => {
        const isComplete = isStockAvailableCompleted && isStockSellByCompleted && isStockUnitCompleted && isStockUnitFractionCompleted && isStockAvailabilityDescCompleted;
        return isComplete;
    }, [isStockAvailableCompleted, isStockSellByCompleted, isStockUnitCompleted, isStockUnitFractionCompleted, isStockAvailabilityDescCompleted]);

    const stockStepsCompletedCount = useMemo(() => {
        return [isStockAvailableCompleted, isStockSellByCompleted, isStockUnitCompleted, isStockUnitFractionCompleted, isStockAvailabilityDescCompleted].filter((step) => step).length;
    }, [isStockAvailableCompleted, isStockSellByCompleted, isStockUnitCompleted, isStockUnitFractionCompleted, isStockAvailabilityDescCompleted]);

    
    const isDescriptionCompleted = useMemo(() => {
        return typeof currentProduct.description === "object" && currentProduct.description !== null;
     }, [currentProduct.description]);


    const importProductById = async () => {
        const promise = () => new Promise<ProductItem>(async (resolve, reject) => {
            if (productIdInputRef.current) {
                await getProductByIdAdmin(Number(productIdInputRef.current.value))
                    .then((data) => {
                        if (data.success) {
                            resolve(data.product)
                        } else {
                            console.log("Wystąpił błąd podczas importu produktu. Spróbuj ponownie.", data)
                            reject("Wystąpił błąd podczas importu produktu. Spróbuj ponownie.")
                        }
                    })
                    .catch(() => {
                        console.log("Wystąpił błąd podczas importu produktu. Spróbuj ponownie. 2")
                        reject("Wystąpił błąd podczas importu produktu. Spróbuj ponownie.")
                    })
            } else {
                console.log("Brak inputa")
                reject("Brak inputa")
            }
        });

        setIsLoading(true);
        toast.promise(promise, {
            loading: 'Importowanie produktu...',
            success: (data: ProductItem) => {
                setCurrentProduct({
                    id: null,
                    name: data.name,
                    iconImage: `https://elektromaniacy.pl/${data.icon}`,
                    categoryId: "",
                    type: "product",
                    price: data.price.price.gross.value.toString(),
                    taxPercent: data.price.tax.vatPercent,
                    discount: 0,
                    shortDescription: data.description,
                    description: null,
                    group: "",
                    variant: "",
                    amount: data.sizes[0].amount,
                    sellBy: data.unit.sellBy,
                    unit: data.unit.singular,
                    unitFraction: data.unit.fraction,
                    shippingToday: data.sizes[0].shipping.today,
                    available: data.sizes[0].availability.visible,
                    availabilityDesc: data.sizes[0].availability.description,
                    images: data.enclosuresImages.map((image) => {
                        return {
                            type: image.type,
                            typeSecond: image.type,
                            url: `https://elektromaniacy.pl/${image.url}`,
                            urlSecond: `https://elektromaniacy.pl/${image.url}`,
                            width: image.width,
                            height: image.height
                        }
                    }),
                    status: "draft",
                })
                return `Produkt został zaimportowany pomyślnie.`;
            },
            error: 'Error',
            finally: () => {
                setIsLoading(false);
            }
        });
    }

    const handlePickIconImage = () => {
        pickFile().then((url) => {
            setCurrentProduct(prev => ({ ...prev, iconImage: url }));
        });
    }

    const handlePickImage = () => {
        pickFile().then(async (url) => {
            const newImage = await getUploadedFileByURL(url)

            if (newImage.success && newImage.file) {
                const image = {
                    type: newImage.file.type,
                    typeSecond: "",
                    url: newImage.file.url,
                    urlSecond: newImage.file.urlSecond,
                    width: newImage.file.width,
                    height: newImage.file.height
                }
                setCurrentProduct(prev => ({ ...prev, images: [...prev.images, image] }));
            }
        });
    }

    const handleSaveBtnClick = async () => {
        setIsLoading(true);
        await createOrUpdateProduct(currentProduct)
            .then(data => {
                if (data.success) {
                    toast.success(data.success)
                    setSelectedProduct({ label: currentProduct.name, value: currentProduct.id?.toString() || "", status: "live", image: currentProduct.iconImage })
                    setCurrentProduct(prev => ({ ...prev, id: data.productId }))
                    fetchAllProducts()
                } else {
                    toast.error(data.error)
                }
            })
            .catch(() => {
                toast.error("Wystąpił błąd podczas zapisywania produktu. Spróbuj ponownie.")
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

    return (
        <>
            {/* <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Produkty
                </h2>
            </div>

            {productsResponse.success && (
                <ProductsTableComponent products={productsResponse.products.map(product => { return {name: product.name, id: product.originalId, productId: product.id } })} />
            )} */}
            <div className="flex items-center border-b pb-2 justify-between">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger disabled={isPendingFetching} asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            disabled={isPendingFetching}
                            aria-expanded={open}
                            aria-label="Select a product"
                            className={cn('w-[600px] h-[60px] justify-between')}>
                            {selectedProduct ? (
                                <>
                                    <div className='w-6 h-6 rounded-sm mr-2 p-1 bg-white flex items-center justify-center'>
                                        <img src={selectedProduct.image} alt={selectedProduct.label} className='w-full' />
                                    </div>
                                    <p className='text-balance'>{selectedProduct.label}</p>
                                </>
                            ) : (
                                <p className='text-xs text-muted-foreground'>Wybierz produkt</p>
                            )}
                            <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[600px] p-0">
                        <Command>
                            <CommandInput placeholder="Wyszukaj nazwę..." />
                            <CommandList>
                                <CommandEmpty>Brak wyników.</CommandEmpty>
                                <CommandGroup heading={"Produkty"}>
                                    {products.map((product) => (
                                        <CommandItem
                                            key={product.value}
                                            onSelect={async () => {
                                                const promise = () => new Promise<ProductDB>(async (resolve, reject) => {
                                                    await getProduct(product.value).then((data) => {
                                                        if (data) {
                                                            const { price, ...rest } = data
                                                            resolve({ ...rest, price: price.toString() })
                                                        } else {
                                                            reject("Wystąpił błąd podczas pobierania produktu. Spróbuj ponownie.")
                                                        }
                                                    })
                                                });
                                        
                                                setIsLoading(true);
                                                toast.promise(promise, {
                                                    loading: 'Ładowanie produktu...',
                                                    success: (data: ProductDB) => {
                                                        setCurrentProduct(data)
                                                        return `Produkt został wczytany pomyślnie.`;
                                                    },
                                                    error: 'Wystąpił błąd podczas pobierania produktu. Spróbuj ponownie.',
                                                    finally: () => {
                                                        setIsLoading(false);
                                                        setSelectedProduct(product);
                                                        setOpen(false);
                                                    }
                                                });
                                            }}
                                            className="text-sm cursor-pointer">
                                            <div className='w-6 h-6 rounded-sm mr-2 p-1 bg-white flex items-center justify-center'>
                                                <img src={product.image} alt={product.label} className='w-full' />
                                            </div>
                                            {product.label}
                                            {/* {product.status === 'draft' ? (
                                                <div className='ml-1 rounded-full bg-slate-500 text-xs text-white py-0.5 px-2'>DRAFT</div>
                                            ) : (
                                                <div className='ml-1 rounded-full bg-emerald-500 text-xs text-white py-0.5 px-2'>LIVE</div>
                                            )} */}
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto h-4 w-4',
                                                    selectedProduct?.value ===
                                                        product.value
                                                        ? 'opacity-100'
                                                        : 'opacity-0'
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                <div className='flex items-center'>
                    {!selectedProduct && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="ml-4"
                                >
                                    <ImportIcon className='w-4 h-4 mr-2' />
                                    Importuj produkt
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Zaimportuj produkt</DialogTitle>
                                    <DialogDescription>
                                        Aby zaimportować nowy produkt, wklej jego ID ze sklepu Elektromaniacy poniżej.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="productId" className="text-right min-w-max">
                                            ID produktu
                                        </Label>
                                        <Input
                                            id="productId"
                                            defaultValue="11216"
                                            type="number"
                                            ref={productIdInputRef}
                                            className="col-span-3"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="submit" onClick={importProductById}>Importuj</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}
                    {selectedProduct && (
                        <Button
                            variant="outline"
                            className="ml-4"
                            onClick={() => {
                                setSelectedProduct(null);
                                setCurrentProduct({
                                    id: null,
                                    name: "",
                                    iconImage: "",
                                    categoryId: "",
                                    type: "product",
                                    price: "0",
                                    taxPercent: 23,
                                    discount: 0,
                                    shortDescription: "",
                                    description: null,
                                    group: "",
                                    variant: "",
                                    amount: 0,
                                    sellBy: 1,
                                    unit: "szt.",
                                    unitFraction: "sztuka",
                                    shippingToday: false,
                                    available: true,
                                    availabilityDesc: "",
                                    images: [],
                                    status: "draft",
                                })
                            }}>
                            Dodaj nowy produkt
                        </Button>
                    )}
                    <Button
                        variant="default"
                        className="ml-4"
                        disabled={!isGeneralInfoStepCompleted || !isVariantStepCompleted || !isStockStepCompleted || !isDescriptionCompleted || currentProduct.images.length === 0 || isLoading || currentProduct.iconImage === ""}
                        onClick={handleSaveBtnClick}
                    >
                        {isLoading ? <Loader2Icon className="w-4 h-4 animate-spin mr-2" /> : <SaveIcon className="w-4 h-4 mr-2" />}
                        {currentProduct.id ? "Zapisz zmiany" : "Dodaj produkt"}
                    </Button>
                </div>
            </div>
            <div className='mt-5 flex justify-center gap-4 h-full'>
                <div className='flex flex-col max-w-[400px] w-full gap-4'>
                    <Card className='w-full h-min'>
                        <CardHeader className='p-3'>
                            <h1 className='text-md font-semibold'>Zdjęcie produktu</h1>
                        </CardHeader>
                        <CardContent className='p-3 border-t'>
                            <div className='flex flex-col gap-4'>
                                <div className="grid w-full items-center gap-1.5">
                                    <Label htmlFor="photo">Główna ikona produktu</Label>
                                    {currentProduct.iconImage ? (
                                        <img src={currentProduct.iconImage} alt="" className='h-[300px] w-full rounded-lg object-contain' />
                                    ) : (
                                        <div className='border border-dashed rounded-lg h-[300px] flex flex-col items-center justify-center'>
                                            <ImageIcon className='w-8 h-8 text-muted-foreground mb-2' />
                                            <p className='text-sm text-muted-foreground font-medium'>Dodaj nowe zdjęcie</p>
                                        </div>
                                    )}
                                    <div className='flex items-center gap-2'>
                                        <Button className='px-3 py-1.5' onClick={handlePickIconImage}>
                                            <ImageIcon className='w-3 h-3 mr-2' />
                                            Wybierz zdjęcie
                                        </Button>
                                        <Button className='px-3 py-1.5' variant={"outline"} disabled={currentProduct.iconImage === ""}>
                                            <TrashIcon className='w-3 h-3 mr-2' />
                                            Usuń
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className='flex flex-col w-full'>
                        <Card className='w-full h-min'>
                            <CardContent className='p-3'>
                                <div className='flex'>
                                    {currentProduct.iconImage ? (
                                        <div className='w-[100px] h-[100px] border rounded-lg p-2 flex items-center justify-center'>
                                            <img src={currentProduct.iconImage} alt="" className='w-full rounded-lg' />
                                        </div>
                                    ) : (
                                        <Skeleton className='w-[100px] h-[100px] rounded-lg' />
                                    )}
                                    <div className='ml-2'>
                                        {currentProduct.name ? (
                                            <h1 className='text-md font-semibold max-w-[250px] truncate'>{currentProduct.name}</h1>
                                        ) : (
                                            <Skeleton className='w-[220px] h-4 mb-2' />
                                        )}
                                        {currentProduct.shortDescription ? (
                                            <p className='text-xs text-muted-foreground max-w-[250px] line-clamp-2 mb-2'>{currentProduct.shortDescription}</p>
                                        ) : (
                                            <>
                                                <Skeleton className='w-[170px] h-2 mb-1' />
                                                <Skeleton className='w-[190px] h-2 mb-3' />  
                                            </>
                                        )}
                                        {currentProduct.price && currentProduct.price !== "0" ? (
                                            <h1 className='text-lg font-semibold w-[70px]'>{currentProduct.price}zł</h1>
                                        ) : (
                                            <Skeleton className='w-[70px] h-5' />
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <p className='w-full text-center text-xs mt-1 text-muted-foreground/30'>Product&apos;s Card Preview</p>
                    </div>
                </div>
                <div className='flex flex-col gap-3 w-full'>
                    <Card className='w-full'>
                        <CardHeader className='p-3'>
                                <div className='flex items-center justify-between'>
                                    <h1 className='text-md font-semibold'>Ogólne informacje</h1>
                                    <div className='flex items-center gap-1'>
                                        <StepperComponent completed={generalInfoStepsCompletedCount} all={7} />
                                        <div className='p-[5px] border rounded-sm cursor-pointer' onClick={toggleGeneralInfo}>
                                            {isOpenGeneralInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            {isOpenGeneralInfo && (
                                <CardContent className='p-3 border-t'>
                                    <div className='flex flex-col gap-3'>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="name">Nazwa</Label>
                                            <Input disabled={isLoading} type="productName" id="name" value={currentProduct.name} onChange={(e) => setCurrentProduct(prev => ({ ...prev, name: e.target.value }))} placeholder="Wpisz nazwę produktu" />
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="code">Kategoria</Label>
                                                <Select disabled={isLoading} onValueChange={(e) => setCurrentProduct(prev => ({ ...prev, categoryId: e }))} value={currentProduct.categoryId}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Wybierz kategorię produktu" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem> 
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="type">Typ</Label>
                                                <Select disabled={true} onValueChange={(e) => setCurrentProduct(prev => ({ ...prev, type: e }))} value={currentProduct.type}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Wybierz typ produktu" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="product">Produkt</SelectItem>
                                                        <SelectItem value="addon">Dodatek</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className='flex items-center gap-2'>
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="price">Cena (PLN)</Label>
                                                <Input disabled={isLoading} type="price" id="price" placeholder="Wpisz cenę" value={currentProduct.price} onChange={(e) => setCurrentProduct(prev => ({ ...prev, price: e.target.value }))} />
                                            </div>
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="discount">Zniżka (%)<span className='text-xs text-muted-foreground font-normal'>(opcjonalnie)</span></Label>
                                                <Input disabled={isLoading} type="number" id="discount" placeholder="Wpisz procent zniżki" value={currentProduct.discount} onChange={(e) => setCurrentProduct(prev => ({ ...prev, discount: parseFloat(e.target.value) }))} />
                                            </div>
                                            <div className="grid w-full items-center gap-1.5">
                                                <Label htmlFor="vat">Procent podatku (%)</Label>
                                                <Input disabled={isLoading} type="number" id="vat" placeholder="23" value={currentProduct.taxPercent} onChange={(e) => setCurrentProduct(prev => ({ ...prev, taxPercent: parseFloat(e.target.value) }))} />
                                            </div>
                                        </div>

                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="desc">Krótki opis</Label>
                                            <Textarea id="desc" placeholder="Wpisz krótki opis produktu" value={currentProduct.shortDescription} onChange={(e) => setCurrentProduct(prev => ({ ...prev, shortDescription: e.target.value }))} />
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                    </Card>
                    <Card className='w-full'>
                        <CardHeader className='p-3'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-md font-semibold'>Warianty</h1>
                                <div className='flex items-center gap-1'>
                                    <StepperComponent completed={enableGroup ? variantStepsCompletedCount : 1} all={enableGroup ? 2 : 1} />
                                    <div className='p-[5px] border rounded-sm cursor-pointer' onClick={toggleVariant}>
                                        {isOpenVariant ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        {isOpenVariant && (
                            <CardContent className='p-3 border-t'>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex items-center justify-between p-3 border rounded-lg'>
                                        <div className=''>
                                            <h1 className='text-sm font-semibold'>Produkt posiada grupę</h1>
                                            <p className='text-xs text-muted-foreground'>Włącz, jeśli ten produkt posiada swoje inne wersje, np wersje długości stołu</p>
                                        </div>
                                        <Switch checked={enableGroup} onCheckedChange={setEnableGroup} />
                                    </div>

                                    <div className={cn('flex items-center gap-2 relative')}>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="type">Nazwa grupy</Label>
                                            <Select disabled={!enableGroup || isLoading} value={currentProduct.group} onValueChange={(value) => setCurrentProduct(prev => ({ ...prev, group: value }))}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Wybierz nazwę grupy" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {productGroups.map((group) => (
                                                        <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="type">Wersja</Label>
                                            <Select disabled={!enableGroup || isLoading || (enableGroup && currentProduct.group === "")} value={currentProduct.variant} onValueChange={(value) => setCurrentProduct(prev => ({ ...prev, variant: value }))}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Wybierz wersję grupy" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {productGroups.map((group) => {
                                                        if (group.id === currentProduct.group) {
                                                            return group.variants.map((variant) => (
                                                                <SelectItem key={variant} value={variant}>{variant}</SelectItem>
                                                            ))
                                                        }
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                    <Card className='w-full'>
                        <CardHeader className='p-3'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-md font-semibold'>Opis produktu</h1>
                                <div className='flex items-center gap-1'>
                                    <StepperComponent completed={isDescriptionCompleted ? 1 : 0} all={1} />
                                    <div className='p-[5px] border rounded-sm cursor-pointer' onClick={toggleDescription}>
                                        {isOpenDescription ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        {isOpenDescription && (
                            <CardContent className='p-3 border-t'>
                                <div className='flex flex-col gap-3'>
                                    <Editor
                                        currentProduct={currentProduct}
                                        setCurrentProduct={setCurrentProduct}
                                    />
                                </div>
                            </CardContent>
                        )}
                    </Card>
                    <Card className='w-full'>
                        <CardHeader className='p-3'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-md font-semibold'>Dostępność</h1>
                                <div className='flex items-center gap-1'>
                                    <StepperComponent completed={stockStepsCompletedCount+2} all={7} />
                                    <div className='p-[5px] border rounded-sm cursor-pointer' onClick={toggleStock}>
                                        {isOpenStock ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        {isOpenStock && (
                            <CardContent className='p-3 border-t'>
                                <div className='flex flex-col gap-3'>
                                    <div className='flex items-center gap-2'>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="available">Dostępna ilość</Label>
                                            <Input disabled={isLoading} type="number" id="available" placeholder="Wpisz ilość produktu w magazynie" value={currentProduct.amount} onChange={(e) => setCurrentProduct(prev => ({ ...prev, amount: parseInt(e.target.value) }))} />
                                        </div>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="sellBy">Po ile szt. sprzedawane</Label>
                                            <Input disabled={isLoading} type="number" id="sellBy" placeholder="Np.: sprzedawane po 10 szt." value={currentProduct.sellBy} onChange={(e) => setCurrentProduct(prev => ({ ...prev, sellBy: parseInt(e.target.value) }))} />
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="unit">Skrót jednostki</Label>
                                            <Input disabled={isLoading} type="text" id="unit" placeholder="szt." value={currentProduct.unit} onChange={(e) => setCurrentProduct(prev => ({ ...prev, unit: e.target.value }))} />
                                        </div>
                                        <div className="grid w-full items-center gap-1.5">
                                            <Label htmlFor="unitFraction">Nazwa jednostki</Label>
                                            <Input disabled={isLoading} type="text" id="unitFraction" placeholder="sztuka" value={currentProduct.unitFraction} onChange={(e) => setCurrentProduct(prev => ({ ...prev, unitFraction: e.target.value }))} />
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between p-3 border rounded-lg'>
                                        <div className=''>
                                            <h1 className='text-sm font-semibold'>Wysyłka tego samego dnia</h1>
                                            <p className='text-xs text-muted-foreground'>Zaznacz, jeśli produkt wysyłany jest od razu po zamówieniu (w godzinach pracy)</p>
                                        </div>
                                        <Switch disabled={isLoading} checked={currentProduct.shippingToday} onCheckedChange={(value) => setCurrentProduct(prev => ({ ...prev, shippingToday: value }))} />
                                    </div>
                                    <div className='flex items-center justify-between p-3 border rounded-lg'>
                                        <div className=''>
                                            <h1 className='text-sm font-semibold'>Produkt niedostępny</h1>
                                            <p className='text-xs text-muted-foreground'>Zaznacz, jeśli chcesz, żeby produkt był niedostępny mimo dostępnej ilości</p>
                                        </div>
                                        <Switch disabled={isLoading} checked={!currentProduct.available} onCheckedChange={(value) => setCurrentProduct(prev => ({ ...prev, available: !value }))} />
                                    </div>
                                    <div className="grid w-full items-center gap-1.5">
                                        <Label htmlFor="desc">Opis dostępności</Label>
                                        <Textarea disabled={isLoading} id="desc" placeholder="Np. możliwość kontkatu w sprawie wysyłki" value={currentProduct.availabilityDesc} onChange={(e) => setCurrentProduct(prev => ({ ...prev, availabilityDesc: e.target.value }))} />
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                    <Card className='w-full'>
                        <CardHeader className='p-3'>
                            <div className='flex items-center justify-between'>
                                <h1 className='text-md font-semibold'>Zdjęcia produktu</h1>
                                <div className='flex items-center gap-1'>
                                    <p className='text-xs font-medium'>Ilość zdjęć: <span className='font-semibold'>{currentProduct.images.length}</span></p>
                                    <div className='p-[5px] border rounded-sm cursor-pointer' onClick={toggleImages}>
                                        {isOpenImages ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        {isOpenImages && (
                            <CardContent className='p-3 border-t'>
                                <div className='grid grid-cols-4 gap-4 select-none'>
                                    {currentProduct.images.map((image, index) => (
                                        <div key={index} className='group w-full border rounded-lg p-1 flex items-center justify-center h-[140px] relative transition-all'>
                                            <img src={image.url} alt="" className='max-h-full rounded-sm' />
                                            <div className='absolute inset-0.5 bg-black/50 hidden group-hover:flex items-center justify-center gap-1 rounded-sm'>
                                                <div className='bg-primary/90 rounded-sm p-1 cursor-pointer'>
                                                    <ScanSearchIcon className='w-4 h-4 text-white' />
                                                </div>
                                                <div className='bg-rose-500/90 rounded-sm p-1 cursor-pointer' onClick={() => {
                                                    setCurrentProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
                                                }}>
                                                    <TrashIcon className='w-4 h-4 text-white' />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className='w-full border rounded-lg p-1 flex items-center justify-center cursor-pointer hover:bg-black/5 transition-all' onClick={handlePickImage}>
                                        <PlusIcon className='w-8 h-8 text-primary' />
                                    </div>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}
