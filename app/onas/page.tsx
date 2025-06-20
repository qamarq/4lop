/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { ChevronRight, HashIcon, MailIcon, MapPinIcon, PhoneIcon, SendIcon } from "lucide-react"
import styles from "@/styles/About.module.scss"

import icon1 from "@/assets/about/1.png"
import icon2 from "@/assets/about/2.png"
import icon3 from "@/assets/about/3.png"
import icon4 from "@/assets/about/4.png"
import img1 from "@/assets/about/img1.png"
import img2 from "@/assets/about/img2.png"
import img3 from "@/assets/about/img3.png"
import img4 from "@/assets/about/img4.png"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { cn } from '@/lib/utils'
import ContactForm from './_components/ContactForm'

export const metadata: Metadata = {
    title: 'O nas - 4lop',
    description: 'Generated by create next app',
}

export default async function AboutPage() {
    const contactFooter = JSON.parse((await prisma.pageContent.findFirst({ where: { elementId: 'contactFooter' } }))?.content || '[]') as {id: string, label: string, image: string}[]
    const aboutContent = JSON.parse((await prisma.pageContent.findFirst({ where: { elementId: 'aboutContent' } }))?.content || '[]') as {id: string, title: string, content: string, image: string, icon: string}[]

    return (
        <>
            <div className={styles.container4lop}>
                <h4 className={styles.navigation_label}>Strona główna <ChevronRight size={18} style={{marginInline: 6}} /> O nas</h4>
                <div className={styles.title}>
                    <h1>O nas</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.about_container}>
                    {aboutContent.map((item, index) => {
                        const textContent = item.content.split("\\n").map((text, index) => <p key={index} className={styles.text_fragment}>{text}</p>)
                        return (
                            <div key={item.id} className={cn(styles.about_item, {
                                [styles.reverse]: index % 2 !== 0
                            })}>
                                <div className={styles.leftitem}>
                                    <div className={styles.header}>
                                        <img src={item.icon} alt="" className={styles.icon} />
                                        <h1 className={styles.title}>{item.title}</h1>
                                    </div>
                                    
                                    {textContent}
                                </div>
                                <div className={styles.rightitem}>
                                    <img src={item.image} alt="" className={styles.image} />
                                </div>
                            </div>
                        )
                    })}
                    {/* <div className={styles.about_item}>
                        <div className={styles.leftitem}>
                            <div className={styles.header}>
                                <Image src={icon1} alt="" className={styles.icon} />
                                <h1 className={styles.title}>Najwyższa jakość</h1>
                            </div>
                            <p className={styles.text_fragment}>Stoły do pakowania 4lop to solidne konstrukcje, do których wykonania wykorzystywane są tylko najlepszej jakości materiały. </p>
                            <p className={styles.text_fragment}>Każdy stół wyposażony jest w płytę meblową, którą łatwo będzie wymienić po ewentualnym zużyciu oraz stabilne, niepodatne na korozję , metalowe ramy.</p>
                        </div>
                        <div className={styles.rightitem}>
                            <Image src={img1} alt="" className={styles.image} />
                        </div>
                    </div>
                    <div className={`${styles.about_item} ${styles.reverse}`}>
                        <div className={styles.leftitem}>
                            <div className={styles.header}>
                                <Image src={icon2} alt="" className={styles.icon} />
                                <h1 className={styles.title}>Doświadczenie</h1>
                            </div>
                            <p className={styles.text_fragment}>Markę 4lop tworzą ludzie z doświadczeniem – marka 4lop to my! </p>
                            <p className={styles.text_fragment}>Staramy się, aby nasza wiedza mogła przełożyć się na praktyczne efekty, dlatego postanowiliśmy stworzyć stoły do pakowania paczek, które nie tylko mocno zautomatyzują sam proces pakowania, ale przede wszystkim poprawią komfort pracy.</p>
                        </div>
                        <div className={styles.rightitem}>
                            <Image src={img2} alt="" className={styles.image} />
                        </div>
                    </div>
                    <div className={styles.about_item}>
                        <div className={styles.leftitem}>
                            <div className={styles.header}>
                                <Image src={icon3} alt="" className={styles.icon} />
                                <h1 className={styles.title}>Kreatywność</h1>
                            </div>
                            <p className={styles.text_fragment}>Dzięki zdobytym przez lata kompetencjom, jesteśmy w stanie, zaproponować naszym klientom najlepiej sprawdzone i najbardziej praktyczne rozwiązania na rynku. </p>
                            <p className={styles.text_fragment}>Służą jako stoły magazynowe do pakowania oraz zaopatrują małe biznesy w stanowisko do pakowania paczek, niektórzy również wykorzystują nasze produkty jako stół do streczowania.</p>
                        </div>
                        <div className={styles.rightitem}>
                            <Image src={img3} alt="" className={styles.image} />
                        </div>
                    </div>
                    <div className={`${styles.about_item} ${styles.reverse}`}>
                        <div className={styles.leftitem}>
                            <div className={styles.header}>
                                <Image src={icon4} alt="" className={styles.icon} />
                                <h1 className={styles.title}>Elastyczność</h1>
                            </div>
                            <p className={styles.text_fragment}>Nie ograniczamy się w możliwościach – każdy stół do pakowania paczek dopasowujemy pod indywidualne potrzeby klienta i rozbudowujemy go o inne komponenty czy gotowe moduły. </p>
                            <p className={styles.text_fragment}>
                            Nasze stoły można wykorzystać niezależnie od wielkości firmy, dlatego też stoły 4lop mają tak wiele zastosowań. Wszystkie łączy jedno – wspólna potrzeba zadowolenia klienta.</p>
                        </div>
                        <div className={styles.rightitem}>
                            <Image src={img4} alt="" className={styles.image} />
                        </div>
                    </div> */}
                </div>
            </div>
            <div className={styles.container4lop}>
                <div className={styles.title}>
                    <h1>Napisz do nas</h1>
                    <span className={styles.line} />
                </div>

                <div className={styles.contact_container}>
                    <div className={styles.item}>
                        <h1>Kontakt</h1>

                        {/* <div className={styles.subitem}>
                            <PhoneIcon className={styles.icon} size={20} />
                            <p>+48 519 653 388</p>
                        </div>
                        <div className={styles.subitem}>
                            <MailIcon className={styles.icon} size={20} />
                            <p>kontakt@4lop.pl</p>
                        </div>
                        <div className={styles.subitem}>
                            <MapPinIcon className={styles.icon} size={20} />
                            <p>ul. Żółkiewskiego 12, 87-100 Toruń</p>
                        </div>
                        <div className={styles.subitem}>
                            <HashIcon className={styles.icon} size={20} />
                            <p>NIP: 879-269-40-85</p>
                        </div> */}
                        {contactFooter.map((item) => (
                            <div key={item.id} className={styles.subitem}>
                                <img src={item.image} className={cn("w-4 h-4", styles.icon)} alt={item.label} />
                                <p>{item.label}</p>
                            </div>
                        ))}
                    </div>
                    <ContactForm />
                </div>
            </div>
       </>
    )
}
