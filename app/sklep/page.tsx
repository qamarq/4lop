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

export default function ShopPage() {
    const [resultPage, setResultPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [sortingName, setSortingName] = useState<string>("");
    const [sortingMaxPrice, setSortingMaxPrice] = useState<number>(5000);
    const [sortingOptions, setSortingOptions] = useState<string>("bestFit_desc");
    const divToScroll = useRef<HTMLDivElement>(null);
    const [returnResults, setReturnResults] = useState<GetProductResponse>({
        results: { resultCount: 0, resultPage: 8, currentPage: 0, limitPerPage: 0 },
        orderBy: { name: "", type: '' },
        filtrContext: { name: "", value: 0 },
        products: [],
    })

    const getProducts = async (myAbortController: AbortController | null) => {
        setLoading(true)
        const response = await fetch('/api/shop/get', {
            method: 'POST',
            signal: myAbortController ? myAbortController.signal : null,
            body: JSON.stringify({page: resultPage, limit: 12, text: sortingName, maxPrice: sortingMaxPrice, orderBy: { name: sortingOptions.split("_")[0], type: sortingOptions.split("_")[1] }}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const responseData = await response.json();
            setReturnResults(responseData.returnData)
        } else {
            const errorResponse = await response.json();
            console.error(errorResponse);
        }
        setLoading(false)
    }

    useEffect(() => {
        const myAbortController = new AbortController();
        getProducts(myAbortController)

        return () => {
            myAbortController.abort();
        };
    }, [resultPage])

    const handlePagination = (paginationData: any) => {
        if (resultPage === paginationData.currentPage-1) return;
        setTimeout(() => {
            setLoading(true)
            setResultPage(paginationData.currentPage-1)
        }, 500)
    };

    return (
        <>
            {/* <div className={styles.container}>
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
            <div className={styles.container}>
                <h4 className={styles.navigation_label}>Strona główna <ChevronRight size={18} style={{marginInline: 6}} /> Nasza oferta</h4>

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
                                                    id={product.id.toString()} 
                                                    name={product.name} 
                                                    image={`https://elektromaniacy.pl/${product.icon}`} 
                                                    price={product.price.price.gross.value} 
                                                    tax={product.price.tax.vatPercent} 
                                                    cart={true}
                                                    link={product.link}
                                                /> 
                                            ))}
                                        </>
                                    
                                </div>
                            )}
                        </>
                    )}
                    <div className={styles.filters}>
                        <h1 className={styles.title}>Filtry</h1>
                        <p>Znaleziono <span>{returnResults.results.resultCount}</span> stołów</p>

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
                        <div className="grid w-full items-center gap-1 mb-3">
                            <Label htmlFor="rozmiar">Rozmiar stołu</Label>
                            <Select defaultValue="default">
                                <SelectTrigger id="rozmiar">
                                    <SelectValue placeholder="Wybierz rozmiar" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Rozmiary stołów</SelectLabel>
                                        <SelectItem value="default">Wszystkie</SelectItem>
                                        <SelectItem value="140">140cm</SelectItem>
                                        <SelectItem value="160">160cm</SelectItem>
                                        <SelectItem value="180">180cm</SelectItem>
                                        <SelectItem value="200">200cm</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full items-center gap-1 mb-3">
                            <Label htmlFor="Sortowanie">Sortowanie</Label>
                            <Select value={sortingOptions} onValueChange={(e) => setSortingOptions(e)}>
                                <SelectTrigger id="Sortowanie">
                                    <SelectValue placeholder="Wybierz sortowanie" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Dostępne opcje</SelectLabel>
                                        <SelectItem value="bestFit_desc">Domyślnie</SelectItem>
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
                                step={1}
                                id="cena"
                                className={"w-[100%] mt-1"}
                            />
                        </div>
                        <div className="grid w-full items-center gap-1 mb-4">
                            <Label htmlFor="search">Wyszukaj</Label>
                            <Input type="text" id="search" value={sortingName} onChange={(e) => setSortingName(e.target.value)} placeholder="Wpisz nazwę produktu" />
                        </div>
                        <Button disabled={loading} className="w-[100%]" onClick={() => getProducts(null)}>
                            {loading ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <FilterIcon className="mr-2 h-4 w-4" />} Zastosuj filtry
                        </Button>
                    </div>
                </div>
                {returnResults?.products?.length > 0 && (
                    <PaginationComponent totalRecords={returnResults.results.resultCount} pageLimit={returnResults.results.limitPerPage} onPageChanged={handlePagination} onClick={() => {
                        if (divToScroll.current) {
                            divToScroll.current.scrollIntoView({ behavior: 'smooth' });
                        }
                    }} />   
                )}
            </div>
        </>
    )
}
