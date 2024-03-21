/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { addToBasket, getBasket, prepareBasketProducts, removeFromBasket, updateBasket } from "@/actions/basket";
import { toast } from "@/components/ui/use-toast";
import { LOCALSTORAGE_CART_KEY_NAME, LOCALSTORAGE_TMPCART_KEY_NAME, SAVED_ORDER_SETTINGS_NAME } from "@/constants";
import { formattedPrice, getNetPrice } from "@/lib/utils";
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";

type DeliveryUpdate = { courierId: string, prepaid: boolean } | null;

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addItem: ({ id, quantity }: { id: string, quantity: number }) => Promise<void>;
    updateItem: ({ id, quantity }: { id: string, quantity: number }) => Promise<void>;
    removeItem: (id: string) => Promise<void>;
    resetCart: () => Promise<void>;
    delivery: {courierId: string, prepaid: boolean} | null;
    updateDelivery: (data: DeliveryUpdate) => Promise<void>;
    payment: "prepaid" | null | "dvp";
    updatePayment: (payment: "prepaid" | null | "dvp") => Promise<void>;
    insurance: boolean;
    updateInsurance: (active: boolean) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const buildOfflineCart = async () => {
    let cartRAW = localStorage.getItem(LOCALSTORAGE_CART_KEY_NAME);
    if (!cartRAW) cartRAW = "[]"
    const cart = JSON.parse(cartRAW);
    const basketProducts = await prepareBasketProducts(cart)
    
    const basketData: Cart = {
        basketCost: {
            shippingUndefined: true,
            basketShippingCost: {
                shippingCost: { value: 0, currency: "pln", formatted: formattedPrice(0) },
                shippingCostAfterRebate: 0,
                shopVat: 0,
            },
            prepaidCost: { value: 0, currency: "pln", formatted: "0.00 zł" },
            insuranceCost: { value: 0, currency: "pln", formatted: "0.00 zł" },
            totalProductsCost: {
                value: basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price, 0),
                currency: "pln",
                formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price, 0))
            },
            totalAdditionalCost: {
                value: 0,
                currency: "pln",
                formatted: "0.00 zł",
            },
            totalRebate: { value: 0, currency: "pln", formatted: "0.00 zł" },
            totalRebateWithoutShipping: {
                value: 0,
                currency: "pln",
                formatted: "0.00 zł",
            },
            totalToPay: { value: basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price, 0), currency: "pln", formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price, 0)) },
        },
        summaryBasket: {
            productsCount: 0,
            worth: {
                gross: { value: basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price, 0), currency: "pln", formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price, 0)) },
                net: { value: 0, currency: "pln", formatted: "0.00 zł" },
            },
            rebate: { value: 0, currency: "pln", formatted: "0.00 zł" },
            beforeRebate: {
                gross: { value: 0, currency: "pln", formatted: "0.00 zł" },
                net: { value: 0, currency: "pln", formatted: "0.00 zł" },
            },
            shipping: { cost: { value: 0, currency: "pln", formatted: "0.00 zł" }, shippingDays: 0 },
        },
        products: basketProducts.map((basketProduct) => {
            return {
                id: basketProduct.productId,
                size: "test",
                comment: "",
                availableNow: true,
                additional: "",
                quantity: basketProduct.quantity,
                worth: {
                    gross: {
                        value: basketProduct.quantity * basketProduct.productDetails.price,
                        currency: "pln",
                        formatted: formattedPrice(basketProduct.quantity * basketProduct.productDetails.price)
                    },
                    net: {
                        value: basketProduct.quantity * getNetPrice(basketProduct.productDetails.price, basketProduct.productDetails.taxPercent),
                        currency: "pln",
                        formatted: formattedPrice(basketProduct.quantity * getNetPrice(basketProduct.productDetails.price, basketProduct.productDetails.taxPercent))
                    }
                },
                tax: { worth: { value: 0, currency: "PLN", formatted: "" }, vatPercent: basketProduct.productDetails.taxPercent, vatString: `${basketProduct.productDetails.taxPercent/100}%` },
                data: basketProduct.productDetails,
                basketGroupId: 0,
                versionsName: basketProduct.productDetails.variant,
                valuesVersionName: "",
                bundleProducts: null
            }
        })
    };  
    
    return basketData
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [delivery, setDelivery] = useState<{courierId: string, prepaid: boolean} | null>(null)
    const [payment, setPayment] = useState<"prepaid" | null | "dvp">(null)
    const [insurance, setInsurance] = useState<boolean>(false)
    const [loading, setLoading] = useState(true);
    const fetchedFirstTime = useRef(false);

    const addOfflineItem = async ({ id, quantity, notEnough = false }: { id: string, quantity: number, notEnough: boolean }): Promise<void> => {
        let cartRAW = localStorage.getItem(notEnough ? LOCALSTORAGE_TMPCART_KEY_NAME : LOCALSTORAGE_CART_KEY_NAME);
        if (!cartRAW) cartRAW = "[]"
        const cart = JSON.parse(cartRAW);
        const existingItemIndex = cart.findIndex((product: any) => product.id === id );
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({id, quantity})
        }
        localStorage.setItem(notEnough ? LOCALSTORAGE_TMPCART_KEY_NAME : LOCALSTORAGE_CART_KEY_NAME, JSON.stringify(cart));
        toast({
            description: "Dodano do koszyka"
        })
    }

    const removeOfflineItem = async (id: string): Promise<void> => {
        let cartRAW = localStorage.getItem(LOCALSTORAGE_CART_KEY_NAME);
        if (!cartRAW) cartRAW = "[]"
        const cart = JSON.parse(cartRAW);
        const existingItemIndex = cart.findIndex((product: any) => product.id === id );
        if (existingItemIndex !== -1) {
            cart.splice(existingItemIndex, 1)
        }
        localStorage.setItem(LOCALSTORAGE_CART_KEY_NAME, JSON.stringify(cart));
        toast({
            description: "Usunięto z koszyka"
        })
    }

    const updateOfflineItem = async ({ id, quantity }: { id: string, quantity: number }): Promise<void> => {
        let cartRAW = localStorage.getItem(LOCALSTORAGE_CART_KEY_NAME);
        if (!cartRAW) cartRAW = "[]"
        const cart = JSON.parse(cartRAW);
        const existingItemIndex = cart.findIndex((product: any) => product.id === id );
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity = quantity;
        }
        localStorage.setItem(LOCALSTORAGE_CART_KEY_NAME, JSON.stringify(cart));
    }

    const fetchCart = async () => {
        await getBasket(delivery?.courierId)
            .then(async (data) => {
                if (data.success) {
                    const offlineCartRAW = localStorage.getItem(LOCALSTORAGE_CART_KEY_NAME);
                    if (offlineCartRAW) {
                        const offlineCart = JSON.parse(offlineCartRAW);
                        let somethingWasAdded = false
                        offlineCart.forEach(async (item: { id: string, quantity: number }) => {
                            await addToBasket(item.id, item.quantity)
                                .then((data) => {
                                    if (data.success) {
                                        somethingWasAdded = true
                                    } else if (data.error) {
                                        toast({
                                            variant: "destructive",
                                            description: data.error
                                        })
                                    }
                                })
                        })
                        somethingWasAdded && toast({
                            description: "Dodano do koszyka produkty zapisane w pamięci lokalnej"
                        })
                        localStorage.removeItem(LOCALSTORAGE_CART_KEY_NAME)
                        fetchCart()
                    }
                    setCart(data.data)
                } else if (data.error) {
                    if (data.error === "not_logged_in") {
                        const offlineCart = await buildOfflineCart()
                        setCart(offlineCart)
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
    };
    
    useEffect(() => {
        if (!fetchedFirstTime.current) {
            fetchCart();
            fetchedFirstTime.current = true;
        }
    }, [])

    useEffect(() => {
        const saved = localStorage.getItem(SAVED_ORDER_SETTINGS_NAME);
        if (!saved) {return}
        const savedConfig = JSON.parse(saved) as SavedOrderSettings;
        setPayment(savedConfig.payment)
        setInsurance(savedConfig.insurance || false)
        setDelivery(savedConfig.delivery)
    }, []);

    useEffect(() => {
        fetchCart();
    }, [delivery])

    // useEffect(() => {
    //     if (cart.length > 0) {
    //         localStorage.setItem('cart', JSON.stringify(cart));
    //     }
    // }, [cart]);

    const addItem = async ({ id, quantity }: { id: string, quantity: number }): Promise<void> => {
        if (cart) {
            const tmpCart = cart
            let updatedCart = JSON.parse(JSON.stringify(cart)) as Cart;

            const existingItemIndex = updatedCart.products.findIndex(
                (product) => product.id === id
            );

            if (existingItemIndex !== -1) {
                updatedCart.products[existingItemIndex].quantity += quantity;
            }

            setCart(updatedCart);

            await addToBasket(id, quantity)
                .then((data) => {
                    if (data.success) {
                        toast({
                            description: "Dodano do koszyka"
                        })
                        if (existingItemIndex === -1) {
                            fetchCart()
                        }
                    } else if (data.error) {
                        if (data.error === "not_logged_in") {
                            addOfflineItem({ id, quantity, notEnough: false })
                            fetchCart()
                        } else if (data.notEnoughProducts) {
                            addOfflineItem({ id, quantity, notEnough: true })
                            fetchCart()
                        } else {
                            toast({
                                description: data.error,
                                variant: "destructive"
                            })
                            setCart(tmpCart)
                        }
                    }
                })
        }
    };

    const updateItem = async ({ id, quantity }: { id: string, quantity: number }): Promise<void> => {
        if (cart) {
            const tmpCart = cart
            let updatedCart = JSON.parse(JSON.stringify(cart)) as Cart;

            const existingItemIndex = updatedCart.products.findIndex(
                (product) => product.id === id
            );

            if (existingItemIndex !== -1) {
                updatedCart.products[existingItemIndex].quantity = quantity;
            }

            setCart(updatedCart);

            await updateBasket(id, quantity)
                .then((data) => {
                    if (data.success) {
                        toast({
                            description: "Zaktualizowano pomyślnie"
                        })
                        fetchCart()
                    } else if (data.error) {
                        if (data.error === "not_logged_in") {
                            updateOfflineItem({ id, quantity })
                            fetchCart()
                        } else {
                            toast({
                                variant: "destructive",
                                description: data.error
                            })
                            setCart(tmpCart)
                        }
                    }
                })
        }
    };

    const removeItem = async (id: string): Promise<void> => {
        // setCart((prev) => prev.filter((item) => item.id !== id));
        if (cart) {
            const tmpCart = cart
            let updatedCart = JSON.parse(JSON.stringify(cart)) as Cart;
            updatedCart.products = cart.products.filter((product) => {
                return !(product.id === id);
            });
            setCart(updatedCart);

            await removeFromBasket(id)
                .then((data) => {
                    if (data.success) {
                        toast({
                            description: "Usunięto pomyślnie"
                        })
                        fetchCart()
                    } else if (data.error) {
                        if (data.error === "not_logged_in") {
                            removeOfflineItem(id)
                            fetchCart()
                        } else {
                            toast({
                                variant: "destructive",
                                description: "Wystąpił błąd"
                            })
                            setCart(tmpCart)
                        }
                    }
                })
        }
    };

    const resetCart = async (): Promise<void> => {
        // setCart([]);
        const response = await fetch('/api/shop/basket/clear', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("success");
        } else {
            console.log("error");
        }
    };

    const updateDelivery = async (data: DeliveryUpdate): Promise<void> => {
        setDelivery(data);
    }

    const updateInsurance = async (active: boolean): Promise<void> => {
        setInsurance(active);
    }

    const updatePayment = async (data: "prepaid" | null | "dvp"): Promise<void> => {
        setPayment(data);
    }

    const refreshCart = async (): Promise<void> => {
        fetchCart()
    }

    return (
        <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, resetCart, delivery, updateDelivery, payment, updatePayment, insurance, updateInsurance, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
