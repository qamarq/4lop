/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { addToBasket, getBasket, removeFromBasket, updateBasket } from "@/actions/basket";
import { toast } from "@/components/ui/use-toast";
import { LOCALSTORAGE_CART_KEY_NAME, SAVED_ORDER_SETTINGS_NAME } from "@/constants";
import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";

type DeliveryUpdate = { courierId: string, prepaid: boolean } | null;

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addItem: ({ id, size, quantity }: { id: number, size: string, quantity: number }) => Promise<void>;
    updateItem: ({ id, size, quantity }: { id: number, size: string, quantity: number }) => Promise<void>;
    removeItem: (id: number, size: string) => Promise<void>;
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
    const cart = localStorage.getItem(LOCALSTORAGE_CART_KEY_NAME);
    
    const basketData: Cart = {
        basketCost: {
            shippingUndefined: true,
            basketShippingCost: {
                shippingCost: { value: 0, currency: "pln", formatted: "0.00 zł" },
                shippingCostAfterRebate: 0,
                shopVat: 0,
            },
            prepaidCost: { value: 0, currency: "pln", formatted: "0.00 zł" },
            insuranceCost: { value: 0, currency: "pln", formatted: "0.00 zł" },
            totalProductsCost: {
                value: 0,
                currency: "pln",
                formatted: "0.00 zł",
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
            totalToPay: { value: 0, currency: "pln", formatted: "0.00 zł" },
        },
        summaryBasket: {
            productsCount: 0,
            worth: {
                gross: { value: 0, currency: "pln", formatted: "0.00 zł" },
                net: { value: 0, currency: "pln", formatted: "0.00 zł" },
            },
            rebate: { value: 0, currency: "pln", formatted: "0.00 zł" },
            beforeRebate: {
                gross: { value: 0, currency: "pln", formatted: "0.00 zł" },
                net: { value: 0, currency: "pln", formatted: "0.00 zł" },
            },
            shipping: { cost: { value: 0, currency: "pln", formatted: "0.00 zł" }, shippingDays: 0 },
        },
        products: []
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

    const fetchCart = async () => {
        await getBasket(delivery?.courierId)
            .then(async (data) => {
                if (data.success) {
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

    const addItem = async ({ id, size, quantity }: { id: number, size: string, quantity: number }): Promise<void> => {
        if (cart) {
            const tmpCart = cart
            let updatedCart = JSON.parse(JSON.stringify(cart)) as Cart;

            const existingItemIndex = updatedCart.products.findIndex(
                (product) => product.id === id && product.size === size
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
                    } else {
                        toast({
                            description: data.error,
                            variant: "destructive"
                        })
                        setCart(tmpCart)
                    }
                })
        }
    };

    const updateItem = async ({ id, size, quantity }: { id: number, size: string, quantity: number }): Promise<void> => {
        if (cart) {
            const tmpCart = cart
            let updatedCart = JSON.parse(JSON.stringify(cart)) as Cart;

            const existingItemIndex = updatedCart.products.findIndex(
                (product) => product.id === id && product.size === size
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
                    } else {
                        toast({
                            variant: "destructive",
                            description: data.error
                        })
                        setCart(tmpCart)
                    }
                })
        }
    };

    const removeItem = async (id: number, size: string): Promise<void> => {
        // setCart((prev) => prev.filter((item) => item.id !== id));
        if (cart) {
            const tmpCart = cart
            let updatedCart = JSON.parse(JSON.stringify(cart)) as Cart;
            updatedCart.products = cart.products.filter((product) => {
                return !(product.id === id && product.size === size);
            });
            setCart(updatedCart);

            await removeFromBasket(id)
                .then((data) => {
                    if (data.success) {
                        toast({
                            description: "Usunięto pomyślnie"
                        })
                        fetchCart()
                    } else {
                        toast({
                            variant: "destructive",
                            description: "Wystąpił błąd"
                        })
                        setCart(tmpCart)
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
