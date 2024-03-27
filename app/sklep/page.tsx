"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ChevronRight, FilterIcon, Loader2Icon } from "lucide-react";
import styles from "@/styles/Shop.module.scss";
import { HomeProduct, HomeProductSekelet } from '@/components/HomeProduct';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { v4 } from 'uuid';
import { Label } from '@/components/ui/label';
import { PaginationComponent } from '@/components/pagination';
import { getAllCategories, getAllGroups, getProductsPagination } from '@/actions/shop';
import { Category, Group } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';

export default function ShopPage({ searchParams }: { searchParams?: { page?: string, category?: string, sort?: string } }) {
    const currentPage = Number(searchParams?.page)-1 || 0;
    const currentCategory = searchParams?.category || "default";
    const currentSort = searchParams?.sort || "bestFit_asc";

    const pathname = usePathname();
    const { replace } = useRouter();

    const [resultPage, setResultPage] = useState(currentPage);
    const [loading, setLoading] = useState(true);

    const [sortingMaxPrice, setSortingMaxPrice] = useState<number>(5000);
    const [sortingOptions, setSortingOptions] = useState<string>(currentSort);
    const [selectedCategory, setSelectedCategory] = useState<string>(currentCategory);

    const divToScroll = useRef<HTMLDivElement>(null);
    const [returnResults, setReturnResults] = useState<GetProductResponse>({
        results: { resultCount: 0, resultPage: 0, currentPage: 0, limitPerPage: 0 },
        orderBy: { name: "", type: '' },
        filtrContext: { name: "", value: 0 },
        products: [],
    })

    const [categories, setCategories] = useState<Category[]>([])
    const [groups, setGroups] = useState<Group[]>([])

    const getProducts = async ({ options }: { options: { sort: string, category: string } }) => {
        setLoading(true)

        await getProductsPagination(resultPage, 12, options).then(data => setReturnResults(data))
        await getAllCategories().then(data => setCategories(data))
        await getAllGroups().then(data => setGroups(data))
        
        setLoading(false)
    }

    useEffect(() => {
        getProducts({ options: { sort: sortingOptions, category: selectedCategory } })
    }, [resultPage])

    const handlePagination = (paginationData: any) => {
        if (resultPage === paginationData.currentPage-1) return;
        setTimeout(() => {
            setLoading(true)
            setResultPage(paginationData.currentPage-1)
        }, 500)
    };

    const handleChangeCategory = (category: string) => {
        const params = new URLSearchParams(searchParams);

        if (category === "default") {
            params.delete('category')
        } else {
            params.set('category', category)
        }

        replace(`${pathname}?${params.toString()}`);
        getProducts({ options: { sort: sortingOptions, category } })
    }

    const handleChangeSorting = (sort: string) => {
        const params = new URLSearchParams(searchParams);

        if (sort === "bestFit_desc") {
            params.delete('sort')
        } else {
            params.set('sort', sort)
        }

        replace(`${pathname}?${params.toString()}`);
        getProducts({ options: { sort, category: selectedCategory } })
    }

    return (
        <>
            {/* <div className={styles.container4lop}>
                <h4 className={styles.navigation_label}>Strona główna <ChevronRight size={18} style={{marginInline: 6}} /> Nasza oferta</h4>

                <div className={styles.title}>
                    <h1>Nasze stoły</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.promoted_container}>
                    <div className={styles.item}>
                        <img src="/promoted/3.png" alt="" />
                        <div className={styles.text}>
                            <p>Stoły standard</p>
                            <ChevronRight size={25} />
                        </div>
                    </div>
                    <div className={styles.item}>
                        <img src="/promoted/1.png" alt="" />
                        <div className={styles.text}>
                            <p>Stoły Rozszerzone</p>
                            <ChevronRight size={25} />
                        </div>
                    </div>
                    <div className={styles.item}>
                        <img src="/promoted/2.png" alt="" />
                        <div className={styles.text}>
                            <p>Stoły Pakowe</p>
                            <ChevronRight size={25} />
                        </div>
                    </div>
                </div>
            </div> */}
            <div className={styles.container4lop}>
                <h4 className={styles.navigation_label}>Strona główna <ChevronRight size={18} style={{marginInline: 6}} /> Sklep</h4>

                <div className={styles.title}>
                    <h1>Wszystkie produkty</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.shop_container} ref={divToScroll}>
                    {loading ? (
                        <div className={styles.items}>
                            {Array(6).fill(0).map((_, i) => (
                                <HomeProductSekelet key={i} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {!returnResults || !returnResults.products ? (
                                <div className='w-full h-full flex items-center justify-center'>
                                    <p className='font-medium text-xl uppercase text-gray-600'>Nie znaleziono żadnych produktów</p>
                                </div>
                            ) : (
                                <div className={styles.items}>
                                        <>
                                            {returnResults.products.map((product) => (
                                                <HomeProduct 
                                                    key={v4()} 
                                                    id={product.id || ""} 
                                                    name={product.name} 
                                                    image={product.iconImage} 
                                                    price={parseFloat(product.price)} 
                                                    tax={product.taxPercent} 
                                                    cart={true}
                                                /> 
                                            ))}
                                            {returnResults.products.length === 0 && (
                                                <div className='w-full h-full flex items-center justify-center'>
                                                    <p className='font-medium text-xl uppercase text-gray-600'>Nie znaleziono żadnych produktów</p>
                                                </div>
                                            )}
                                        </>
                                    
                                </div>
                            )}
                        </>
                    )}
                    <div className={styles.filters}>
                        <h1 className={styles.title}>Filtry</h1>
                        <p>Znaleziono <span>{returnResults.results.resultCount}</span> produktów</p>

                        {/* <LayoutGroup>
                            <motion.div className={styles.filters_items}>
                                <FilterItem title="Rodzaje stołów" items={["Typ 1", "Typ 2", "Typ 3"]} />
                                <FilterItem title="Rozmiary stołów" items={["Rozmiar 1", "Rozmiar 2", "Rozmiar 3"]} />
                                <FilterItem title="Sortowanie" items={["Sortowanie 1", "Sortowanie 2", "Sortowanie 3"]} />
                                <motion.div layout layoutId="szukaj" className={styles.input}>
                                    <input type="text" placeholder="Wyszukaj produkt" />
                                </motion.div>
                                <motion.button layout layoutId="stosuj" className={styles.button}>
                                    <p>Zastosuj filtry</p>
                                </motion.button>
                            </motion.div>
                        </LayoutGroup> */}
                        {/* <div className="grid w-full items-center gap-1 mb-3">
                            <Label htmlFor="rodzaj">Rodzaj stołu</Label>
                            <Select defaultValue="default">
                                <SelectTrigger id="rodzaj">
                                    <SelectValue placeholder="Wybierz rodzaj" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Rodzaje stołów</SelectLabel>
                                        <SelectItem value="default">Wszystkie</SelectItem>
                                        <SelectItem value="apple">Rodzaj 1</SelectItem>
                                        <SelectItem value="banana">Rodzaj 2</SelectItem>
                                        <SelectItem value="blueberry">Rodzaj 3</SelectItem>
                                        <SelectItem value="grapes">Rodzaj 4</SelectItem>
                                        <SelectItem value="pineapple">Rodzaj 5</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div> */}
                        {groups.map((group) => (
                            <div key={group.id} className="grid w-full items-center gap-1 mb-3">
                                <Label htmlFor={group.id}>{group.name}</Label>
                                <Select defaultValue="default" disabled={loading}>
                                    <SelectTrigger id={group.id}>
                                        <SelectValue placeholder={group.name} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>{group.name}</SelectLabel>
                                            <SelectItem value="default">Wszystkie</SelectItem>
                                            {group.variants.map((variant) => (
                                                <SelectItem key={variant} value={variant}>{variant}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                        <div className="grid w-full items-center gap-1 mb-3">
                            <Label htmlFor="Kategorie">Kategorie</Label>
                            <Select value={selectedCategory} onValueChange={(val) => { setSelectedCategory(val); handleChangeCategory(val) }} disabled={loading}>
                                <SelectTrigger id="Kategorie">
                                    <SelectValue placeholder="Wybierz kategorię" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Dostępne opcje</SelectLabel>
                                        <SelectItem value="default">Wszystkie</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>  
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full items-center gap-1 mb-3">
                            <Label htmlFor="Sortowanie">Sortowanie</Label>
                            <Select value={sortingOptions} onValueChange={(val) => { setSortingOptions(val); handleChangeSorting(val) }} disabled={loading}>
                                <SelectTrigger id="Sortowanie">
                                    <SelectValue placeholder="Wybierz sortowanie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Dostępne opcje</SelectLabel>
                                        <SelectItem value="bestFit_asc">Domyślnie</SelectItem>
                                        <SelectItem value="price_asc">Cena: od najtańszych</SelectItem>
                                        <SelectItem value='price_desc'>Cena: od najdroższych</SelectItem>
                                        <SelectItem value='name_asc'>Nazwa: A-Z</SelectItem>
                                        <SelectItem value='name_desc'>Nazwa: Z-A</SelectItem>
                                        <SelectItem value='date_asc'>Data: najstarsze</SelectItem>
                                        <SelectItem value='date_desc'>Data: najnowsze</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full items-center gap-1 mb-4">
                            <Label htmlFor="cena">Maksymalna cena: {sortingMaxPrice}zł</Label>
                            <Slider
                                onValueChange={(e) => setSortingMaxPrice(e[0])}
                                value={[sortingMaxPrice]}
                                max={5000}
                                disabled={loading}
                                step={1}
                                id="cena"
                                className={"w-[100%] mt-1"}
                            />
                        </div>
                        {/* <Button disabled={loading} className="w-[100%]" onClick={() => getProducts()}>
                            {loading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <FilterIcon className="mr-2 h-4 w-4" />} Zastosuj filtry
                        </Button> */}
                    </div>
                </div>
                {returnResults?.products?.length > 0 && (
                    <PaginationComponent totalRecords={returnResults.results.resultCount} defaultPage={currentPage+1} pageLimit={returnResults.results.limitPerPage} onPageChanged={handlePagination} onClick={() => {
                        if (divToScroll.current) {
                            divToScroll.current.scrollIntoView({ behavior: 'smooth' })
                        }
                    }} />   
                )}
            </div>
        </>
    )
}
