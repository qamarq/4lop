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
import { cn, createSlugLink, formattedPrice, prepareLink } from '@/lib/utils'
import { useCart } from '@/hooks/use-cart'
import { getGroupById, getOneProduct } from '@/actions/shop'
import Output from 'editorjs-react-renderer';

export default function ProductPage() {
    const router = useRouter()
    const routerQuery = usePathname()
    const [product, setProduct] = useState<ProductDB | null>(null)
    const [activeImage, setActiveImage] = useState(0)
    const [loading, setLoading] = useState(false);
    const scrollImagesRef = useRef<HTMLDivElement>(null);
    const { addItem } = useCart()
    const firstTimeRef = useRef(true)

    const [group, setGroup] = useState<{ name: string, variants: { name: string, link: string }[]} | null>(null)

    const nextImage = () => {
        if (product) {
            let currentIndex = activeImage
            currentIndex++
            if (currentIndex >= product.images.length) {
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
                currentIndex = product.images.length-1;
            }
            setActiveImage(currentIndex)
        }
    }

    useEffect(() => {
        const fetchProduct = async (productId: string) => {
            await getOneProduct(productId)
                .then(async product => {
                    console.log(product)
                    setProduct(product)

                    if (product?.group) {
                        await getGroupById(product.group)
                            .then(group => {
                                if (group) {
                                    setGroup(group)
                                }
                            })
                    }
                })
        }
        if (routerQuery && firstTimeRef.current) {
            firstTimeRef.current = false;
            const matches = routerQuery.split("-");
            let productId = ""
            if (matches.length > 0) {
                productId = matches[matches.length - 1];
            }
            
            fetchProduct(productId)
        }
    }, [routerQuery])

    const addToBasket = async () => {
        if (!product) return
        setLoading(true);
        await addItem({
            id: product.id || "",
            quantity: 1
        })
        setLoading(false);
    }

    return (
        <>
            {product && (
                <>
                    <div className={styles.container4lop}>
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
                                <img draggable={false} src={product.images[activeImage].url} alt={product.name} />
                                <button onClick={prevImage} className={`${styles.btn_scroll} ${styles.left}`}>
                                    <ChevronLeft size={26} /> 
                                </button>
                                <button onClick={nextImage} className={`${styles.btn_scroll} ${styles.right}`}>
                                    <ChevronRight size={26} /> 
                                </button>
                            </div>
                            <div className={styles.content}>
                                <div className={styles.quick_info}>
                                    <div className={styles.rating}>
                                        <Rating
                                            readonly={true}
                                            size={20}
                                            SVGstyle={{display: 'inline'}}
                                            transition={true}
                                            initialValue={4.5}
                                        />
                                        <p>(opinie: {2})</p>
                                    </div>
                                    |
                                    <div className={styles.producer}>
                                        <p>Producent: <span>4lop</span></p>
                                        <p>Kod produktu: <span>{product.id}</span></p>
                                    </div>
                                </div>
                                <p className={styles.description}>{product.shortDescription}</p>

                                {group && (
                                    <div className={styles.size_item}>
                                        <h1>{group.name}</h1>
                                        <Select onValueChange={(link) => {
                                            router.push(link)
                                        }} defaultValue={createSlugLink(product.name, product.id || "")}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Wybierz rozmiar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {group.variants.map(version => (
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
                                        {/* {product.price.beforeRebate.gross ? (
                                            <>
                                                <h2>{product.price.price.gross.formatted}</h2>
                                                <h3>{product.price.beforeRebate.gross.formatted}</h3>
                                            </>
                                        ) : (
                                            <h2>{product.price.price.gross.formatted}</h2>
                                        )} */}
                                        {product.discount ? (
                                            <>
                                                <h2>{formattedPrice(parseFloat(product.price))}</h2>
                                                <h3>{formattedPrice(parseFloat(product.price)+(parseFloat(product.price)*product.discount))}</h3>
                                            </>
                                        ) : (
                                            <h2>{formattedPrice(parseFloat(product.price))}</h2>
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
                                        {formattedPrice(parseFloat(product.price)-(parseFloat(product.price)*(product.taxPercent/100)))}
                                    </div>
                                </div>

                                <p className='mt-3'>Najniższa cena w ciągu ostatnich 30 dni: <span className='font-semibold'>{formattedPrice(0)}</span></p>

                                <div className={styles.buttons}>
                                    {product.amount < 1 ? (
                                        <Button disabled>
                                            <MailIcon className='h-4 w-4 mr-2' />
                                            {product.availabilityDesc || "Produkt niedostępny"}
                                        </Button>
                                    ) : (
                                        <Button disabled={loading} onClick={addToBasket}>
                                            {loading ? (
                                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <ShoppingCartIcon className='h-4 w-4 mr-2' />
                                            )}
                                            Dodaj do koszyka
                                        </Button>
                                    )}
                                    
                                </div>

                                <div className={styles.images} ref={scrollImagesRef}>
                                    {product.images.map((image, index) => (
                                        <div 
                                            key={v4()}
                                            onClick={() => setActiveImage(index)} 
                                            className={`${styles.item} ${activeImage === index ? styles.active : ""}`}
                                        >
                                            <img draggable={false} src={image.url} alt="" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className={styles.container4lop}>
                        <div className={styles.title}>
                            <h1>Opis produktu</h1>
                            <span className={styles.line} />
                        </div>
                        {/* <div dangerouslySetInnerHTML={{__html: product.description}} className={styles.longdesc}></div> */}
                        <div className={cn(styles.longdesc, "mt-5")}><Output data={ product.description } /></div>
                    </div>

                    {/* <div className={styles.container4lop}>
                        <div className={styles.title}>
                            <h1>Napisz swoją opinię</h1>
                            <span className={styles.line} />
                        </div>
                    </div>

                    <div className={styles.container4lop}>
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
