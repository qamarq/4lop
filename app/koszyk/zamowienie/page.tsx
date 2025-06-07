/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useEffect, useState } from 'react'
import styles from "@/styles/Order.module.scss"
import { CoinsIcon, CreditCardIcon, MapPinIcon, PencilIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import {
    setKey,
    setLanguage,
    setRegion,
    fromAddress,
} from "react-geocode";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { SAVED_ORDER_SETTINGS_NAME } from '@/constants'
import { useCurrentUser } from '@/hooks/use-current-user'
import { getShipmentMethods } from '@/actions/shipment-methods'
import { InpostGeowidget } from "react-inpost-geowidget";
import { Skeleton } from '@/components/ui/skeleton'
import P24Logo from "@/assets/icons/przelewy24-logo.svg"
import { formattedPrice } from '@/lib/utils'

export default function OrderPage() {
    const { cart, delivery, updateDelivery, insurance, updateInsurance, payment: paymentCart, updatePayment } = useCart()
    const [shipping, setShipping] = useState<Shipment[]>([])
    const [selectedPayment, setSelectedPayment] = useState<"prepaid" | "dvp">("prepaid")
    const [shippingMode, setShippingMode] = useState<"prepaid" | "dvp">("prepaid")
    const [selectedParcelLocker, setSelectedParcelLocked] = useState<ParcelLocker | null>(null)
    const [modalPickPaczkomat, setModalPickPaczkomat] = useState(false)
    const [tmpDelivery, setTmpDelivery] = useState({id: "0", prepaid: false})
    const user = useCurrentUser()
    const router = useRouter()

    const handleGeowidgetInit = (event: any) => {
        const api = event.detail.api;
        if (!user) return

        setKey(process.env.NEXT_PUBLIC_GMAPS_API || "");
        setLanguage("pl");
        setRegion("pl");

        fromAddress(`${user.street}, ${user.city} ${user.zipCode}`)
                .then(async ({ results }) => {
                    const { lat, lng } = results[0].geometry.location;
                    api.changePosition({ longitude: lng, latitude: lat }, 16);
                })
      };

    useEffect(() => {
        // Add event listener for Geowidget init event
        document.addEventListener('inpost.geowidget.init', handleGeowidgetInit);
    
        // Cleanup: Remove the event listener when the component unmounts
        return () => {
          document.removeEventListener('inpost.geowidget.init', handleGeowidgetInit);
        };
    }, []);

    useEffect(() => {
        const fetchShipments = async () => {
            if (cart && user) {
                await getShipmentMethods()
                    .then((data) => {
                        if (data.success) {
                            setShipping(data.shipmentMethods)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        };

        fetchShipments();
    }, [cart, user]);

    const summaryClick = () => {
        localStorage.setItem(SAVED_ORDER_SETTINGS_NAME, JSON.stringify({
            payment: paymentCart,
            delivery: {
                courierId: delivery?.courierId,
                prepaid: delivery?.prepaid,
                courierName: shipping.filter(item => item.courier.id === delivery?.courierId)[0].courier.name
            },
            insurance,
            shippingMode,
            selectedPickupPoint: selectedParcelLocker,
            selectedPayment
        }));
        router.push("/koszyk/podsumowanie")
    }

    const onPointCallback = (e: ParcelLocker) => {
        setSelectedParcelLocked(e)
        setModalPickPaczkomat(false)
        updateDelivery({
            courierId: tmpDelivery.id,
            prepaid: tmpDelivery.prepaid
        })
    }

    const setPaczkomat = () => {
        if (user && cart) {
            setModalPickPaczkomat(true)
        }
    }

    return (
        <div className={styles.container4lop}>
            <Dialog open={modalPickPaczkomat} onOpenChange={(open) => setModalPickPaczkomat(open)}>
                <DialogContent className="sm:max-w-[90rem]">
                    <DialogHeader>
                        <DialogTitle>Wybierz punkt odbioru</DialogTitle>
                        <DialogDescription>
                            Wybierz punkt odbioru lub paczkomat, w którym chcesz odebrać swoją paczkę
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-3">
                        <div className="grid grid-cols-8 items-center gap-4">
                            <Label htmlFor="username" className="text-right whitespace-nowrap mr-2 hidden sm:block">
                                Twój adres
                            </Label>
                            <Input
                                id="username"
                                type='address'
                                placeholder='Podaj ilość'
                                disabled
                                defaultValue={user ? `${user.street}, ${user.city} ${user.zipCode}` : ""}
                                className="col-span-5 ml-2"
                            />
                            <Button variant={"outline"} className='col-span-2 ml-2 min-w-max'>
                                Zmień adres
                                <PencilIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className='rounded-lg border p-2 shadow-sm w-full h-[500px]'>
                            <InpostGeowidget
                                token={process.env.NEXT_PUBLIC_INPOST_GEOWIDGET}
                                onPoint={onPointCallback}
                            />
                        </div>
                    </div>
                    {/* <DialogFooter className='items-center'>
                        {selectedParcelLocker && (
                            <p className='text-sm font-light mr-4'>Aktualnie wybrany paczkomat: <span className='font-medium text-orange-500'>{selectedParcelLocker.name}</span></p>
                        )}
                        <Button disabled={selectedParcelLocker === null} type="submit" onClick={() => {
                            setModalPickPaczkomat(false)
                            updateDelivery({
                                courierId: tmpDelivery.id,
                                prepaid: tmpDelivery.prepaid
                            })
                        }}>
                            <MapPinIcon className='h-4 w-4 mr-2' />
                            Wybierz punkt
                        </Button>
                    </DialogFooter> */}
                </DialogContent>
            </Dialog>

            <div className={styles.order_content}>
                <div className={styles.left}>
                    <div className={styles.item}>
                        <div className={styles.head}>
                            <h1>Zamówienie</h1>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.products}>
                                {cart && cart.products.length !== 0 ? (
                                    <>
                                        {cart.products.map((product, index) => (
                                            <div key={index} className={styles.product}>
                                                <div className={styles.image}>
                                                    <img src={product.data.iconImage} alt="" />
                                                </div>
                                                <div className={styles.texts}>
                                                    <h1>{product.data.name}</h1>
                                                    <h2><span>Opis: </span>{product.data.shortDescription}</h2>
                                                    {product.data.variant && (
                                                        <h2><span>Wersja: </span>{product.data.variant}</h2>
                                                    )}
                                                    <h2><span>Cena/szt.: </span>{formattedPrice(product.data.price)}</h2>
                                                </div>
                                                <div className={styles.price}>
                                                    <h1>{product.worth.gross.formatted}</h1>
                                                </div>
                                                <div className={styles.quantity}>
                                                    <h1><span>Ilość: </span>{product.quantity} szt.</h1>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.product}>
                                            <div className={styles.image}>
                                                <img src={``} alt="" />
                                            </div>
                                            <div className={styles.texts}>
                                                <Skeleton className="mb-3 h-4 w-[150px]" />
                                                <Skeleton className="mb-1 h-3 w-[80px]" />
                                                <Skeleton className="mb-1 h-3 w-[100px]" />
                                            </div>
                                            <div className={styles.price}>
                                                <Skeleton className="h-3 w-[60px]" />
                                            </div>
                                            <div className={styles.quantity}>
                                                <Skeleton className="h-3 w-[60px]" />
                                            </div>
                                        </div>
                                        <div className={styles.product}>
                                            <div className={styles.image}>
                                                <img src={``} alt="" />
                                            </div>
                                            <div className={styles.texts}>
                                                <Skeleton className="mb-3 h-4 w-[150px]" />
                                                <Skeleton className="mb-1 h-3 w-[80px]" />
                                                <Skeleton className="mb-1 h-3 w-[100px]" />
                                            </div>
                                            <div className={styles.price}>
                                                <Skeleton className="h-3 w-[60px]" />
                                            </div>
                                            <div className={styles.quantity}>
                                                <Skeleton className="h-3 w-[60px]" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.head}>
                            <div className={styles.texts}>
                                <h1>Dostawa</h1>
                                <h2><span>Dostawa dla adresu: </span>{user && `${user.street}, ${user.zipCode} ${user.city}` }</h2>
                            </div>
                            <Button
                                variant="outline"
                            >
                                Zmień swój adres
                                <PencilIcon className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                        <div className={styles.delivery}>
                            {shipping.length !== 0 ? (
                                <>
                                    {shipping.map((shipping) => {
                                        if (shipping.prepaid !== shippingMode) return null

                                        if (cart && cart.basketCost.totalProductsCost.value > shipping.maxworth) return null

                                        let founded = false
                                        if (shipping.excluding) {
                                            shipping.excludedProducts.forEach((excluded) => {
                                                if (cart && cart.products.filter(product => product.data.id === excluded).length > 0) {
                                                    founded = true
                                                }
                                            })
                                        }
                                        if (founded) return null

                                        return (
                                            <div key={shipping.courier.fullId} className={`${styles.delivery_item} ${delivery && delivery.courierId === shipping.courier.id ? styles.active : ""}`} onClick={() => {
                                                if (shipping.courier.name.toLowerCase().includes("paczkomat")) {
                                                    setPaczkomat()
                                                    setTmpDelivery({
                                                        id: shipping.courier.id.toString(),
                                                        prepaid: shipping.prepaid === "prepaid"
                                                    })
                                                } else {
                                                    updateDelivery({
                                                        courierId: shipping.courier.id.toString(),
                                                        prepaid: shipping.prepaid === "prepaid"
                                                    })
                                                }
                                                
                                            }}>
                                                <img src={shipping.courier.icon} alt="" />
                                                <div className={styles.texts}>
                                                    <h1>{shipping.courier.name}</h1>
                                                    {shipping.courier.pickupPoint === true ? (
                                                        <>
                                                            {selectedParcelLocker ? (
                                                                <p>
                                                                    <span>Miejsce i czas: </span>
                                                                    {selectedParcelLocker.name} - {" "} 
                                                                    {shipping.deliveryTime.time.days === 0 ? (
                                                                        <>{shipping.deliveryTime.time.hours} godzin
                                                                        {shipping.deliveryTime.time.minutes !== 0 && (
                                                                            <>{" "}i{" "}{shipping.deliveryTime.time.minutes} minut</>
                                                                        )}
                                                                        </>
                                                                    ) : (
                                                                        <>{shipping.deliveryTime.time.days} dni</>
                                                                    )}
                                                                </p>
                                                            ) : (
                                                                <p>
                                                                    <span>Czas dostawy: </span>
                                                                    {shipping.deliveryTime.time.days === 0 ? (
                                                                        <>{shipping.deliveryTime.time.hours} godzin
                                                                        {shipping.deliveryTime.time.minutes !== 0 && (
                                                                            <>{" "}i{" "}{shipping.deliveryTime.time.minutes} minut</>
                                                                        )}</>
                                                                    ) : (
                                                                        <>{shipping.deliveryTime.time.days} dni</>
                                                                    )}
                                                                </p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p>
                                                            <span>Czas dostawy: </span>
                                                            {shipping.deliveryTime.time.days === 0 ? (
                                                                <>{shipping.deliveryTime.time.hours} godzin i {" "} 
                                                                {shipping.deliveryTime.time.minutes} minut</>
                                                            ) : (
                                                                <>{shipping.deliveryTime.time.days} dni</>
                                                            )}
                                                        </p>
                                                    )}
                                                    <p>
                                                        <span>Płatność: </span>
                                                        {shipping.prepaid === "prepaid" ? "internetowa" : "za pobraniem"}
                                                    </p>
                                                </div>
                                                <div className={styles.price}>
                                                    <h1>{shipping.cost.formatted}</h1>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                            ) : (
                                <>
                                    <div className={styles.delivery_item}>
                                        <Skeleton className="h-[100%] w-[130px] rounded-sm" />
                                        <div className={styles.texts}>
                                            <Skeleton className="h-4 w-[150px]" />
                                            <div className='my-1 flex items-center gap-2'>
                                                <Skeleton className="h-2 w-[100px]" />
                                            </div>
                                            <div className='my-1 flex items-center gap-2'>
                                                <Skeleton className="h-2 w-[90px]" />
                                            </div>
                                        </div>
                                        <div className={styles.price}>
                                            <Skeleton className="h-4 w-[50px]" />
                                        </div>
                                    </div>
                                    <div className={styles.delivery_item}>
                                        <Skeleton className="h-[100%] w-[130px] rounded-sm" />
                                        <div className={styles.texts}>
                                            <Skeleton className="h-4 w-[150px]" />
                                            <div className='my-1 flex items-center gap-2'>
                                                <Skeleton className="h-2 w-[100px]" />
                                            </div>
                                            <div className='my-1 flex items-center gap-2'>
                                                <Skeleton className="h-2 w-[90px]" />
                                            </div>
                                        </div>
                                        <div className={styles.price}>
                                            <Skeleton className="h-4 w-[50px]" />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.head}>
                            <h1>Płatność</h1>
                        </div>
                        <div className={styles.payments}>
                            <div onClick={() => {
                                setSelectedPayment("prepaid")
                                setShippingMode("prepaid")
                                updatePayment("prepaid")
                                if (shippingMode === "dvp") {
                                    updateDelivery(null)
                                }
                            }} className={`${styles.payment_item} ${selectedPayment === "prepaid" ? styles.active : ""}`}>
                                <Image src={P24Logo} alt={'Przelewy24 Logo'} className='w-8 mr-2' />
                                <h1>Płatność internetowa</h1>
                            </div>
                            <div onClick={() => {
                                setSelectedPayment("dvp")
                                setShippingMode("dvp")
                                updatePayment("dvp")
                                if (shippingMode === "prepaid") {
                                    updateDelivery(null)
                                }
                            }} className={`${styles.payment_item} ${selectedPayment === "dvp" ? styles.active : ""}`}>
                                <CoinsIcon className='h-4 w-4 mr-2' />
                                <h1>Za pobraniem</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.item}>
                        <div className={styles.head}>
                            <h1>Podsumowanie</h1>
                        </div>
                        <div className={styles.card}>
                            <div className={styles.info_item}>
                                <p>Imię i nazwisko: </p>
                                <h1>{user && `${user.firstname} ${user.lastname}`}</h1>
                            </div>
                            <div className={styles.info_item}>
                                <p>Numer telefonu: </p>
                                <h1>{user && `${user.phone}`}</h1>
                            </div>
                            {/* <div className={styles.info_item}>
                                <p>Kupon rabatowy: </p>
                                <h1>Brak</h1>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Input placeholder='Wpisz kupon rabatowy' />
                                <Button variant={"secondary"}>Zastosuj</Button>
                            </div> */}
                            <span className={styles.space}></span>
                            <div className={styles.info_item}>
                                <p>Wartość zamówienia: </p>
                                <h1>{cart && cart.basketCost.totalProductsCost.formatted}</h1>
                            </div>
                            <div className={styles.info_item}>
                                <p>Dostawa: </p>
                                <h1>{cart && cart.basketCost.basketShippingCost.shippingCost.formatted}</h1>
                            </div>
                            <div className={styles.info_item}>
                                <p>W sumie oszczędzasz: </p>
                                <h1>0.00zł</h1>
                            </div>
                            <div className={styles.info_item}>
                                <p>Podsumowanie: </p>
                                <h1>{cart && cart.basketCost.totalToPay.formatted}</h1>
                            </div>
                            <span className={styles.space}></span>
                            <Button 
                                disabled={delivery === null || (delivery && delivery.courierId === "100149" && selectedParcelLocker === null)} 
                                className='w-[100%]'
                                onClick={summaryClick}
                            >
                                Podsumowanie zamówienia
                            </Button>
                            <Button onClick={() => router.push("/koszyk")} className='w-[100%] mt-1' variant={"ghost"}>Wróć do koszyka</Button>
                        </div>
                    </div>
                    <div className={styles.item}>
                        <div className={styles.head}>
                            <h1>Dodatkowe opcje</h1>
                        </div>
                        <div className={`${styles.card} mb-2`}>
                            <div className={styles.addon_item}>
                                <div className={styles.texts}>
                                    <h1>Ochrona Kupującego</h1>
                                    <h2>Możesz aktywować pakiet ochronny Kupującego Trusted Shops</h2>
                                </div>
                                <h2 className={styles.price}>8,99 zł</h2>
                                <Switch
                                    disabled
                                    checked={insurance}
                                    onCheckedChange={(active) => {
                                        updateInsurance(active)
                                    }}
                                />
                            </div>
                        </div>
                        <div className={`${styles.card} mb-2`}>
                            <div className={styles.addon_item}>
                                <div className={styles.texts}>
                                    <h1>Dostawa za punkty</h1>
                                    <h2>Włącz darmową dostawę za punkty lojalnościowe</h2>
                                </div>
                                <Switch disabled />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}