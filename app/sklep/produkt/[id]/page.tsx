/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Loader2Icon, MailIcon, ShoppingCartIcon } from 'lucide-react'
import { Rating } from 'react-simple-star-rating'
import styles from '@/styles/Product.module.scss'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation'
import { v4 } from 'uuid'
import { prepareLink } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { useCurrentUser } from '@/hooks/use-current-user'

export default function ProductPage() {
    const router = useRouter()
    const routerQuery = usePathname()
    const [product, setProduct] = useState<ProductItem | null>(null)
    const [activeImage, setActiveImage] = useState(0)
    const [loading, setLoading] = useState(false);
    const scrollImagesRef = useRef<HTMLDivElement>(null);
    const { addItem } = useCart()
    const user = useCurrentUser()

    const nextImage = () => {
        if (product) {
            let currentIndex = activeImage
            currentIndex++
            if (currentIndex >= product.enclosuresImages.length) {
                currentIndex = 0;
            }
            setActiveImage(currentIndex)
        }
    }

    const prevImage = () => {
        if (product) {
            let currentIndex = activeImage
            currentIndex--
            if (currentIndex < 0) {
                currentIndex = product.enclosuresImages.length-1;
            }
            setActiveImage(currentIndex)
        }
    }

    useEffect(() => {
        const categoriesDiv = scrollImagesRef.current;

        const handleScroll = (event: WheelEvent) => {
            event.preventDefault();
            if (categoriesDiv) {
                categoriesDiv.scrollLeft += event.deltaY;
            }
        };

        if (categoriesDiv) {
            categoriesDiv.addEventListener('wheel', handleScroll, {
                passive: false,
            });
        }

        return () => {
            if (categoriesDiv) {
                categoriesDiv.removeEventListener('wheel', handleScroll);
            }
        };
    }, []);

    useEffect(() => {
        const abortController = new AbortController();
        const getProduct = async () => {
            const { signal } = abortController;
            const matches = routerQuery.split("-");
            let productId = 0
            if (matches.length > 0) {
                productId = parseInt(matches[matches.length - 1]);
            }
            const response = await fetch('/api/shop/getOne', {
                method: 'POST',
                signal,
                body: JSON.stringify({id: productId}),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData.returnData.longDescription)
                responseData.returnData.longDescription = responseData.returnData.longDescription.replace(/"\/data\/include\/cms\//g, '"https://elektromaniacy.pl/data/include/cms/');
                // console.log(responseData.returnData)
                setProduct(responseData.returnData)
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse);
            }
        }
        getProduct()

        return () => {
            abortController.abort();
        };
    }, [routerQuery])

    const addToBasket = async () => {
        if (!product) return
        setLoading(true);
        await addItem({
            id: parseInt(product.code),
            size: product.sizes[0].id,
            quantity: 1
        })
        setLoading(false);
    }

    return (
        <>
            {product && (
                <>
                    <div className={styles.container}>
                        <h4 className={styles.navigation_label}>
                            Strona główna 
                            <ChevronRight size={18} style={{marginInline: 6}} /> 
                            <span className='cursor-pointer' onClick={() => router.push('/sklep')}>Sklep</span>
                            <ChevronRight size={18} style={{marginInline: 6}} /> 
                            {product.name}
                        </h4>
                        <div className={styles.title}>
                            <div className={styles.icon_back} onClick={() => router.push("/sklep")}>
                                <ChevronLeft size={30} />
                            </div>
                            <h1>{product.name}</h1>
                            <span className={styles.line} />
                        </div>

                        <section className={styles.hero}>
                            <div className={styles.thumbnail}>
                                <img draggable={false} src={`https://elektromaniacy.pl/${product.enclosuresImages[activeImage].mediumUrl}`} alt={product.name} />
                                <div onClick={prevImage} className={`${styles.btn_scroll} ${styles.left}`}>
                                    <ChevronLeft size={26} /> 
                                </div>
                                <div onClick={nextImage} className={`${styles.btn_scroll} ${styles.right}`}>
                                    <ChevronRight size={26} /> 
                                </div>
                            </div>
                            <div className={styles.content}>
                                <div className={styles.quick_info}>
                                    <div className={styles.rating}>
                                        <Rating
                                            readonly={true}
                                            size={20}
                                            SVGstyle={{display: 'inline'}}
                                            transition={true}
                                            initialValue={product.opinion.rating}
                                        />
                                        <p>(opinie: {product.opinion.count})</p>
                                    </div>
                                    |
                                    <div className={styles.producer}>
                                        <p>Producent: <span>{product.producer.name}</span></p>
                                        <p>Kod produktu: <span>{product.code}</span></p>
                                    </div>
                                </div>
                                <p className={styles.description}>{product.description}</p>

                                {product.group.versions && (
                                    <div className={styles.size_item}>
                                        <h1>{product.group.name}</h1>
                                        <Select onValueChange={(link) => {
                                            router.push(`/sklep/produkt/${prepareLink(link)}`)
                                        }} defaultValue={product.group.link}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Wybierz rozmiar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {product.group.versions.map(version => (
                                                        <SelectItem key={v4()} value={version.link}>{version.name}</SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className={styles.price_item}>
                                    <h1>Cena brutto</h1>
                                    <div className={styles.price}>
                                        {product.price.beforeRebate.gross.value ? (
                                            <>
                                                <h2>{product.price.price.gross.formatted}</h2>
                                                <h3>{product.price.beforeRebate.gross.formatted}</h3>
                                            </>
                                        ) : (
                                            <h2>{product.price.price.gross.formatted}</h2>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.price_subitem}>
                                    <h1>Cena netto</h1>
                                    <div className={styles.price}>
                                        {/* {product.promotion ? (
                                            <>
                                                <h2>{((product.price-(product.price*(product.promotion/100))) - (product.price*(product.tax/100))).toFixed(2)}zł</h2>
                                                <h3>{(product.price-(product.price*(product.tax/100))).toFixed(2)}zł</h3>
                                            </>
                                        ) : (
                                            <h2>{(product.price-(product.price*(product.tax/100))).toFixed(2)}zł</h2>
                                        )} */}
                                        {product.price.price.net.formatted}
                                    </div>
                                </div>

                                <p className='mt-3'>Najniższa cena w ciągu ostatnich 30 dni: <span className='font-semibold'>{product.price.omnibusPrice.gross.formatted}</span></p>

                                <div className={styles.buttons}>
                                    {product.sizes[0].amount < 1 ? (
                                        <Button disabled>
                                            <MailIcon className='h-4 w-4 mr-2' />
                                            {product.sizes[0].availability.description}
                                        </Button>
                                    ) : (
                                        <>
                                        {user !== undefined ? (
                                            <Button disabled={loading} onClick={addToBasket}>
                                                {loading ? (
                                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <ShoppingCartIcon className='h-4 w-4 mr-2' />
                                                )}
                                                Dodaj do koszyka
                                            </Button>
                                        ) : (
                                            <Button onClick={() => router.push('/auth/login')}>
                                                <ShoppingCartIcon className='h-4 w-4 mr-2' />
                                                Zaloguj się aby dodać do koszyka
                                            </Button>
                                        )}
                                        </>
                                    )}
                                    
                                </div>

                                <div className={styles.images} ref={scrollImagesRef}>
                                    {product.enclosuresImages.map((image, index) => (
                                        <div 
                                            key={v4()}
                                            onClick={() => setActiveImage(index)} 
                                            className={`${styles.item} ${activeImage === index ? styles.active : ""}`}
                                        >
                                            <img draggable={false} src={`https://elektromaniacy.pl/${image.mediumUrl}`} alt="" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.title}>
                            <h1>Opis produktu</h1>
                            <span className={styles.line} />
                        </div>
                        <div dangerouslySetInnerHTML={{__html: product.longDescription}} className={styles.longdesc}></div>
                    </div>

                    {/* <div className={styles.container}>
                        <div className={styles.title}>
                            <h1>Napisz swoją opinię</h1>
                            <span className={styles.line} />
                        </div>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.title}>
                            <h1>Zobacz również</h1>
                            <span className={styles.line} />
                        </div>
                    </div> */}
                </>
            )}
        </>
    )
}
