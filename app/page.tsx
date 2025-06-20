/* eslint-disable @next/next/no-img-element */
import { ChevronRight, ChevronsDown, PhoneOutgoing, Plus } from 'lucide-react';
import styles from '../styles/Home.module.scss';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import img1 from '@/assets/icons/img1.png';
import img2 from '@/assets/icons/img2.png';
import img3 from '@/assets/icons/img3.png';
import img4 from '@/assets/icons/img4.png';
import heroImg from '@/public/hero.png';
import card1 from '@/assets/cards/card1.png';
import card2 from '@/assets/cards/card2.png';
import card3 from '@/assets/cards/card3.png';
import { HomeProduct } from '@/components/HomeProduct';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { FAQContainer, QuickFAQ } from '@/components/faqItems';
import { Checkbox } from '@/components/ui/checkbox';
import Promotions from '@/components/HomeComponents/Promotions';
import { Suspense } from 'react';
import Skelete from '@/components/HomeComponents/Skelete';
import Bestsellers from '@/components/HomeComponents/Bestsellers';
import NewProducts from '@/components/HomeComponents/NewProducts';
import Link from 'next/link';
import { getElementContentByElementId } from '@/actions/manage-page-content';

export default async function Home() {
    const heroTitle = await getElementContentByElementId('heroTitle') || "Profesjonalne stoły do pakowania";
    const heroSubtitle = await getElementContentByElementId('heroSubtitle') || "Z naszą szeroką ofertą masz szansę zmodyfikować swój stół pod zamówienie";
    const heroButtonText = await getElementContentByElementId('heroButtonText') || "Sprawdź";
    const heroButtonLink = await getElementContentByElementId('heroButtonLink') || "/sklep";

    const firstBanner = JSON.parse(await getElementContentByElementId('linkFirstBanner') || '{"title": "", "image": "", "link": ""}') as {title: string, image: string, link: string};
    const secondBanner = JSON.parse(await getElementContentByElementId('linkSecondBanner') || '{"title": "", "image": "", "link": ""}') as {title: string, image: string, link: string};
    const thirdBanner = JSON.parse(await getElementContentByElementId('linkThirdBanner') || '{"title": "", "image": "", "link": ""}') as {title: string, image: string, link: string};

    const faqContent = JSON.parse(await getElementContentByElementId('faqContent') || '[]') as {id: string, title: string, content: string}[];
    
    return (
        <>
            <div className={styles.container4lop}>
                <div className={styles.hero}>
                    <div className={styles.inner}>
                        <div className={styles.content}>
                            <div className={styles.texts}>
                                <h1>{heroTitle}</h1>

                                <h2>{heroSubtitle}</h2>

                                <Link href={heroButtonLink}>
                                    <button className={styles.button}>
                                        <p>{heroButtonText}</p>
                                    </button>
                                </Link>
                            </div>
                            <Image draggable={false} src={heroImg} alt="" />
                            {/* <QuickFAQ /> */}
                            <div className={styles.quick_faq_v2}>
                                <h1 className={styles.faq_item_title}>Stół Rozszerzony</h1>

                                <div className={styles.faq_items}>
                                    <div className={styles.faq_item}>
                                        <Plus size={12} className={styles.icon} />
                                        <p>Blat z płyty meblowej</p>
                                    </div>
                                    <div className={styles.faq_item}>
                                        <Plus size={12} className={styles.icon} />
                                        <p>Praktyczny uchwyt na stretch</p>
                                    </div>
                                    <div className={styles.faq_item}>
                                        <Plus size={12} className={styles.icon} />
                                        <p>Ostry nóż do cięcia folii</p>
                                    </div>
                                    <div className={styles.faq_item}>
                                        <Plus size={12} className={styles.icon} />
                                        <p>Nadstawka</p>
                                    </div>
                                    <div className={styles.faq_item}>
                                        <Plus size={12} className={styles.icon} />
                                        <p>Separator do półki na kartony</p>
                                    </div>
                                    <div className={styles.faq_item}>
                                        <Plus size={12} className={styles.icon} />
                                        <p>Górna półka na kartony</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className={styles.bottom}>
                            <div className={styles.icon_btn}>
                                <PhoneOutgoing size={21} />
                            </div>
                            <div className={styles.icon_down}>
                                <ChevronsDown size={25} />
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <div className={styles.container4lop}>
                <div className={styles.features}>
                    <div className={styles.feature_item}>
                        <Image src={img1} alt="" />
                        <h1>Konfiguracja</h1>
                        <h2>Stwórz własny zestaw</h2>
                    </div>
                    <div className={styles.feature_item}>
                        <Image src={img2} alt="" />
                        <h1>Rabaty</h1>
                        <h2>Dla dużych zamówień</h2>
                    </div>
                    <div className={styles.feature_item}>
                        <Image src={img3} alt="" />
                        <h1>Dostawa</h1>
                        <h2>Własnym kurierem</h2>
                    </div>
                    <div className={styles.feature_item}>
                        <Image src={img4} alt="" />
                        <h1>Kontakt</h1>
                        <h2>Służymy pomocą</h2>
                    </div>
                </div>
            </div>
            <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Szybkie linki</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.fast_links}>
                    <Link href={firstBanner.link} className={styles.card}>
                        <img src={firstBanner.image} alt="" />
                        <div className={styles.card_content}>
                            <p>{firstBanner.title}</p>
                            <ChevronRight size={24} />
                        </div>
                    </Link>
                    <Link href={secondBanner.link} className={styles.card}>
                        <img src={secondBanner.image} alt="" />
                        <div className={styles.card_content}>
                            <p>{secondBanner.title}</p>
                            <ChevronRight size={24} />
                        </div>
                    </Link>
                    <Link href={thirdBanner.link} className={styles.card}>
                        <img src={thirdBanner.image} alt="" />
                        <div className={styles.card_content}>
                            <p>{thirdBanner.title}</p>
                            <ChevronRight size={24} />
                        </div>
                    </Link>
                </div>
            </div>
            <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Promocje</h1>
                    <span className={styles.line} />
                </div>
                <Suspense fallback={<Skelete />}>
                    <Promotions zones={["promotion"]} />
                </Suspense>
            </div>
            <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Nasze bestsellery</h1>
                    <span className={styles.line} />
                </div>
                <Suspense fallback={<Skelete />}>
                    <Promotions zones={["bestseller"]} />
                </Suspense>
                {/* <div className={styles.shop_products}>
                    <HomeProduct id={v4()} name={"Stół Rozbudowany"} image={"/components/1.png"} price={1399.00} promotion={20} newProduct={true} tax={23} />
                    <HomeProduct id={v4()} name={"Stół podstawowy"} image={"/components/2.png"} price={999.00} tax={23} />
                    <HomeProduct id={v4()} name={"Stół rozbudowany"} image={"/components/3.png"} price={1399.00} promotion={30} tax={23} />
                    <div className={styles.right_icon}>
                        <ChevronRight size={64} />
                    </div>
                </div> */}
            </div>
            <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Nowości</h1>
                    <span className={styles.line} />
                </div>
                {/* <div className={styles.shop_products}>
                    <HomeProduct id={v4()} name={"Wózek transportowy na paczki"} image={"/new/1.png"} price={659.00} tax={23} />
                    <HomeProduct id={v4()} name={"Stół warsztatowy"} image={"/new/2.png"} price={1399.00} tax={23} />
                    <HomeProduct id={v4()} name={"Uchwyt na kosz na śmieci"} image={"/new/3.png"} price={159.00} tax={23} />
                    <div className={styles.right_icon}>
                        <ChevronRight size={64} />
                    </div>
                </div> */}
                <Suspense fallback={<Skelete />}>
                    <Promotions zones={["new"]} />
                </Suspense>
            </div>
            <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Pytania i odpowiedzi</h1>
                    <span className={styles.line} />
                </div>

                <FAQContainer faqContent={faqContent} />
            </div>
            <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Obserwuj Nas</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.social_container}>
                    <iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpakujz4lop%2Fposts%2Fpfbid02tBZFKmYq2wvkb2NsksrQmzup6dgwJYPz95zrxJQTxn2uXbtYV3J85XwNx7frbvCUl&show_text=true&width=500" width="500" height="574" style={{border: 'none', overflow: "hidden"}} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                    <iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpakujz4lop%2Fposts%2Fpfbid037G8UrGJHenedoZxi4FTgLNBUJbNSYaqqJ7FcTYbxvayLCUFbGKCNH5oukmmDP4gVl&show_text=true&width=500" width="500" height="529" style={{border: 'none', overflow: "hidden"}} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                    <iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpakujz4lop%2Fposts%2Fpfbid05dfXfQFZUUTHPomsV88nnHpQjrszsh2dRbiezwFCWVNEP6PzKXGmsrCwtVv513Nvl&show_text=true&width=500" width="500" height="593" style={{border: 'none', overflow: "hidden"}} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
                </div>
            </div>
            {/* <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Newsletter</h1>
                    <span className={styles.line} />
                </div>
                <div className={styles.newsletter_container}>
                    <div className={styles.newsletter_inner}>
                        <div className="grid w-full items-center gap-2 mb-4">
                            <Label htmlFor="email">Adres e-mail</Label>
                            <Input type="email" id="email" placeholder="Wpisz swój adres e-mail" />
                        </div>

                        <div className="grid w-full items-center gap-2">
                            <Label htmlFor="email">Twoje zainteresowania</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Wybierz temat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Tematy</SelectLabel>
                                        <SelectItem value="apple">Temat 1</SelectItem>
                                        <SelectItem value="banana">Temat 2</SelectItem>
                                        <SelectItem value="blueberry">Temat 3</SelectItem>
                                        <SelectItem value="grapes">Temat 4</SelectItem>
                                        <SelectItem value="pineapple">Temat 5</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-2 mb-3 mt-3">
                            <Checkbox required id="terms" name='terms' />
                            <label
                                htmlFor="terms"
                                className="text-sm font-small leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Zgadzam się na przetwarzanie danych osobowych
                            </label>
                        </div>

                        <button className={styles.button}>
                            <p>Zapisz się</p>
                        </button>
                    </div>
                </div>
            </div> */}
        </>
    )
}

