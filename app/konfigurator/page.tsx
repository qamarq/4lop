/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect, useState } from 'react'
import styles from '@/styles/Configurator.module.scss'
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { BakeShadows, OrbitControls, Stage } from "@react-three/drei";
import { Button } from '@/components/ui/button'
import { ChevronLeft, Loader2Icon, ShoppingBasketIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { v4 } from 'uuid'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Model, Addon } from "@/components/models";
import { options } from '@/constants';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/components/ui/use-toast';

export default function ConfiguratorPage() {
    const [step, setStep] = useState(1)
    const [selectedTable, setSelectedTable] = useState(0)
    const [selectedSize, setSelectedSize] = useState(0)
    const [totalPrice, setTotalPrice] = useState(0)
    const [appliedAddons, setAppliedAddons] = useState<number[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedTableInfo, setSelectedTableInfo] = useState({
        version: 0,
        price: 0
    })

    const { addItem } = useCart()
    const router = useRouter()

    const tables = [
        {
            len: 140,
            price: 1555,
            code: 13480,
            size: "uniw"
        },
        {
            len: 160,
            price: 1738,
            code: 11216,
            size: "uniw"
        },
        {
            len: 180,
            price: 2020,
            code: 11290,
            size: "uniw"
        },
        {
            len: 200,
            price: 2114,
            code: 11291,
            size: "uniw"
        }
    ]

    useEffect(() => {
        setAppliedAddons([])
        setTotalPrice(0)
    }, [selectedTable])

    useEffect(() => {
        window.scrollTo(0, 0)
        if (step === 4 && selectedSize !== 0 && selectedTable !== 0 && appliedAddons) {
            let price = 0
            appliedAddons.map((appliedAddon) => {
                let addonItem = options[selectedTable-1].addons[appliedAddon-1]
                let selectedVersion = null
                if (addonItem.versions) {
                    selectedVersion = addonItem.versions.find(version => version.len === selectedSize);
                    if (selectedVersion) {
                        price += selectedVersion.price
                    }
                } else if (addonItem.price) {
                    price += addonItem.price
                }
            })

            let tmpTable = tables.find(version => version.len === selectedSize);
            if (tmpTable) {
                setSelectedTableInfo({
                    version: tmpTable.len,
                    price: tmpTable.price
                })
                price += tmpTable.price
            }

            setTotalPrice(price)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [appliedAddons, selectedSize, selectedTable, step])

    const sizes = [140, 160, 180, 200]

    const titles = [
        "Wybierz swój model",
        "Wybierz długość",
        "Dokonaj konfiguracji",
        "Podsumowanie konfiguracji"
    ]

    const addToBasket = async () => {
        setLoading(true)
        let tmpTable = tables.find(version => version.len === selectedSize);
        if (tmpTable) {
            await addItem({ id: tmpTable.code, size: tmpTable.size, quantity: 1 })
            appliedAddons.map(async (appliedAddon) => {
                let addonItem = options[selectedTable-1].addons[appliedAddon-1]
                let selectedVersion = null
                if (addonItem.versions) {
                    selectedVersion = addonItem.versions.find(version => version.len === selectedSize);
                    if (selectedVersion) {
                        await addItem({ id: selectedVersion.code, size: selectedVersion.size, quantity: 1 })
                    }
                } else if (addonItem.code && addonItem.size) {
                    await addItem({ id: addonItem.code, size: addonItem.size, quantity: 1 })
                }
            })

            setTimeout(() => {
                toast({
                    description: "Dodano wszystkie części do koszyka. Zmiana może potrwać chwilę.",
                })
                setLoading(false)
                setStep(1)
                setSelectedTable(0)
                setSelectedSize(0)
                setTotalPrice(0)
                setAppliedAddons([])
            }, 1500)
        }
    }

    return (
        <div className={styles.container}>
            <nav>
                <AnimatePresence>
                    <Button
                        disabled={step === 1}
                        onClick={() => setStep((prev) => prev-1)} 
                        className={styles.btn_back}
                    >
                        <ChevronLeft size={40} />
                    </Button>
                </AnimatePresence>
                <h1>{step}. {titles[step-1]}</h1>
                <span className={styles.line}></span>
            </nav>
            <AnimatePresence>
                <main>
                    {step === 1 && (
                        <motion.div 
                            className={styles.step_one}
                            initial={{opacity: 0}} 
                            animate={{opacity: 1}} 
                            exit={{opacity: 0}}
                        >
                            <div className={styles.items}>
                                {options.map((item, idx) => (
                                    <div 
                                        key={v4()}
                                        onClick={() => setSelectedTable(idx+1)}
                                        className={`${styles.item} ${selectedTable === idx+1 ? styles.active : ""}`}>
                                        <Image 
                                            alt={item.name}
                                            src={item.thumb} 
                                        />
                                        <div className={styles.text}>
                                            <h1>{item.name}</h1>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button disabled={selectedTable === 0} className='w-[230px] mt-5' onClick={() => setStep(2)}>Następny krok</Button>
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div 
                            initial={{opacity: 0}} 
                            animate={{opacity: 1}} 
                            exit={{opacity: 0}}
                            className={styles.step_two}
                        >
                            <div className={styles.image}>
                                <Image src={options[selectedTable-1].thumb} alt={options[selectedTable-1].name} />
                            </div>
                            <div className={styles.options}>
                                <div className={styles.chips}>
                                    {sizes.map(size => (
                                        <div 
                                            key={v4()} 
                                            onClick={() => setSelectedSize(size)}
                                            className={`${styles.chip} ${selectedSize === size ? styles.active : ""}`}
                                        >
                                            <p>{size} cm</p>
                                        </div>
                                    ))}
                                </div>
                                <Button className='mt-6 sm:ml-1 w-[100%] sm:w-[200px]' disabled={selectedSize === 0} onClick={() => setStep(3)}>Następny krok</Button>
                            </div>
                        </motion.div>
                    )}
                    {step === 3 && (
                        <motion.div 
                            className={styles.step_three}
                            initial={{opacity: 0}} 
                            animate={{opacity: 1}} 
                            exit={{opacity: 0}}
                        >
                            <div className={styles.canvas_layout}>
                                <Canvas className={styles.canvas} shadows camera={{ position: [10, 2, 10], fov: 10 }}>
                                    <ambientLight intensity={1} />
                                    <Suspense fallback={null}>
                                        <Stage environment="city" intensity={0.6} adjustCamera={1.3}>
                                            <group position={[0, -2, 0]} rotation={[0, 2, 0]}>
                                                <Model 
                                                    path={options[selectedTable-1].path}
                                                    letter={options[selectedTable-1].letter}
                                                />
                                                {appliedAddons.length > 0 && (
                                                    <>
                                                        {appliedAddons.map(part => (
                                                            <Addon 
                                                                key={part}
                                                                path={options[selectedTable-1].path}
                                                                number={part}
                                                            />
                                                        ))}
                                                    </>
                                                )}
                                            </group>
                                        </Stage>
                                    </Suspense>
                                    <BakeShadows />
                                    <OrbitControls enableDamping makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                                </Canvas>
                            </div>
                            <div className={styles.options_layout}>
                                <div className={styles.options}>
                                    {options[selectedTable-1].addons.map((addon, index) => (
                                        <div 
                                            key={v4()} 
                                            onClick={() => {
                                                if (appliedAddons.includes(index+1)) {
                                                    setAppliedAddons((prev) => prev.filter((number) => number !== index+1));
                                                } else {
                                                    setAppliedAddons(prev => [...prev, index + 1]);
                                                }
                                            }}
                                            className={`${styles.option} ${appliedAddons.includes(index + 1) ? styles.active : ""} ${addon.notAvailable || (addon.depedencies && !addon.depedencies.every(dep => appliedAddons.includes(dep))) ? styles.notAvailable : ""}`}
                                        >
                                            <div className={styles.image}>
                                                <img loading={"eager"} src={`/configurator/${options[selectedTable-1].path}/jpg/${index+1}.jpg`} alt={addon.name} />
                                            </div>
                                            <div className={styles.text}>
                                                <p>{addon.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button onClick={() => setStep(4)}>Przejdź do podsumowania</Button>
                            </div>
                        </motion.div>
                    )}
                    {step === 4 && (
                        <motion.div 
                            className={styles.step_three}
                            initial={{opacity: 0}} 
                            animate={{opacity: 1}} 
                            exit={{opacity: 0}}
                        >
                            <div className={`${styles.canvas_layout} ${styles.summary}`}>
                                <Canvas className={styles.canvas} shadows camera={{ position: [10, 2, 10], fov: 10 }}>
                                    <ambientLight intensity={1} />
                                    <Suspense fallback={null}>
                                        <Stage environment="city" intensity={0.6} adjustCamera={1.1}>
                                            <group position={[0, -2, 0]} rotation={[0, 2, 0]}>
                                                <Model 
                                                    path={options[selectedTable-1].path}
                                                    letter={options[selectedTable-1].letter}
                                                />
                                                {appliedAddons.length > 0 && (
                                                    <>
                                                        {appliedAddons.map(part => (
                                                            <Addon 
                                                                key={part}
                                                                path={options[selectedTable-1].path}
                                                                number={part}
                                                            />
                                                        ))}
                                                    </>
                                                )}
                                            </group>
                                        </Stage>
                                    </Suspense>
                                    <BakeShadows />
                                    <OrbitControls autoRotate autoRotateSpeed={1} enablePan={false} enableZoom={false} enableRotate={false} enableDamping makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                                </Canvas>
                            </div>
                            <div className={styles.options_layout}>
                                <div className={styles.summary}>
                                    <h1>Wybrane opcje</h1>
                                    <h2>{options[selectedTable-1].name}</h2>
                                    <h3>Komponenty:</h3>
                                    <ul>
                                        <li>
                                            Stół podstawowy
                                            <span className={styles.version}>({selectedTableInfo.version}cm)</span>
                                            {/* {" - "}
                                            {selectedTableInfo.price.toFixed(2)} zł */}
                                        </li>
                                        {appliedAddons.map(appliedAddon => {
                                            let addonItem = options[selectedTable-1].addons[appliedAddon-1]
                                            let selectedVersion = null
                                            if (addonItem.versions) {
                                                selectedVersion = addonItem.versions.find(version => version.len === selectedSize);
                                            }
                                            return (
                                                <li key={v4()}>
                                                    {addonItem.name}
                                                    {selectedVersion && (
                                                        <span className={styles.version}>({selectedVersion.len}cm)</span>
                                                    )}
                                                    {/* <span>
                                                        {" - "}{!selectedVersion ? addonItem.price : selectedVersion.price}{" zł"}
                                                    </span> */}
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <Button disabled={loading} className='w-[100%] sm:w-[280px]' onClick={addToBasket}>
                                    {!loading ? <ShoppingBasketIcon className='w-4 h-4 mr-2' /> : <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                                    Dodaj do koszyka
                                    {/* {" - "}
                                    {totalPrice.toFixed(2)} zł */}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </main>
            </AnimatePresence>
        </div>
    )
}
