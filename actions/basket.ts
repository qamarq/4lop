"use server"

import { addToBasketByProductId, getProductFromCart, removeFromBasketByProductId, updateQuantityByProductId } from "@/data/basket";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { formattedPrice } from "@/lib/utils";
import { Product } from "@prisma/client";

export const prepareBasketProducts = async (cart: { id: string, quantity: number }[]) => {
    const basketProducts = await Promise.all(cart.map(async (cartProduct) => {
        const product = await prisma.product.findUnique({ where: { id: cartProduct.id } })

        return {
            productId: cartProduct.id,
            quantity: cartProduct.quantity,
            productDetails: product as Product
        }
    }))

    return basketProducts
}

export const getBasket = async (courierId?: string) => {
    const user = await currentUser()
    if (!user) return { error: "not_logged_in" }

    let userCart = await prisma.cart.findUnique({ where: { userId: user.id } })
    if (!userCart) userCart = await prisma.cart.create({ data: { userId: user.id, products: [] } })

    if (!userCart) return { error: "User cart not found" }

    // const paymentIntent = await stripe.paymentMethods.retrieve("pm_1OWmHlAoTpKuR4XTM7v7IXQX")
    // console.log(paymentIntent)
    
    const basketProducts = await Promise.all(userCart.products.map(async (cartProduct) => {
        // const product = await getProductById(cartProduct.productId)
        const product = await prisma.product.findUnique({ where: { id: cartProduct.productId } })

        return {
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            productDetails: product as Product
        }
    }))

    let shippingCost = 0
    if (courierId) {
        const courier = await prisma.shippingMethod.findUnique({ where: { id: courierId } })
        if (courier) shippingCost = courier.price
    }

    if (basketProducts === null) return { error: "Product not found" }

    const basketData: Cart = {
        basketCost: {
            shippingUndefined: true,
            basketShippingCost: {
                shippingCost: { value: shippingCost, currency: "pln", formatted: formattedPrice(shippingCost) },
                shippingCostAfterRebate: 0,
                shopVat: 0,
            },
            prepaidCost: { value: 0, currency: "pln", formatted: "0.00 zł" },
            insuranceCost: { value: 0, currency: "pln", formatted: "0.00 zł" },
            totalProductsCost: {
                value: basketProducts.reduce((acc, curr) => acc + (curr ? curr.quantity * curr.productDetails.price : 0), 0),
                currency: "pln",
                formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + (curr ? curr.quantity * curr.productDetails.price : 0), 0))
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
            totalToPay: { value: basketProducts.reduce((acc, curr) => acc + (curr ? curr.quantity * curr.productDetails.price : 0), 0) + shippingCost, currency: "pln", formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + (curr ? curr.quantity * curr.productDetails.price : 0), 0) + shippingCost) },
        },
        summaryBasket: {
            productsCount: 0,
            worth: {
                gross: { value: basketProducts.reduce((acc, curr) => acc + (curr ? curr.quantity * curr.productDetails.price : 0), 0) + shippingCost, currency: "pln", formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + (curr ? curr.quantity * curr.productDetails.price : 0), 0) + shippingCost) },
                net: { value: 0, currency: "pln", formatted: "0.00 zł" },
            },
            rebate: { value: 0, currency: "pln", formatted: "0.00 zł" },
            beforeRebate: {
                gross: { value: 0, currency: "pln", formatted: "0.00 zł" },
                net: { value: 0, currency: "pln", formatted: "0.00 zł" },
            },
            shipping: { cost: { value: 0, currency: "pln", formatted: "0.00 zł" }, shippingDays: 0 },
        },
        products: basketProducts !== null ? basketProducts.map((basketProduct) => {
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
                        value: basketProduct.quantity * basketProduct.productDetails.price,
                        currency: "pln",
                        formatted: formattedPrice(basketProduct.quantity * basketProduct.productDetails.price)
                    }
                },
                tax: { worth: { value: 0, currency: "PLN", formatted: "" }, vatPercent: basketProduct.productDetails.taxPercent, vatString: `${basketProduct.productDetails.taxPercent/100}%` },
                data: basketProduct.productDetails,
                basketGroupId: userCart ? parseInt(userCart.id) : 0,
                versionsName: basketProduct.productDetails.group,
                valuesVersionName: "",
                bundleProducts: null
            }
        }) : []
    };    

    return {
        success: true,
        data: basketData
    }
}

export const addToBasket = async (productId: string, quantity: number) => {
    const user = await currentUser()
    if (!user) return { error: "not_logged_in" }

    const userCart = await addToBasketByProductId(user.id, productId, quantity)

    if ('error' in userCart) return { error: userCart.error, notEnoughProducts: userCart.notEnoughProducts }

    return {
        success: true,
        data: userCart.products
    }
}

export const removeFromBasket = async (productId: string) => {
    const user = await currentUser()
    if (!user) return { error: "not_logged_in" }

    const userCart = await removeFromBasketByProductId(user.id, productId)

    if ('error' in userCart) return { error: userCart.error }

    return {
        success: true,
        data: userCart.products
    }
}

export const updateBasket = async (productId: string, quantity: number) => {
    const user = await currentUser()
    if (!user) return { error: "not_logged_in" }

    const userCart = await updateQuantityByProductId(user.id, productId, quantity)

    if ('error' in userCart) return { error: userCart.error }

    return {
        success: true,
        data: userCart.products
    }
}