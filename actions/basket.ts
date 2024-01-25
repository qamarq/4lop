"use server"

import { addToBasketByProductId, getProductFromCart, removeFromBasketByProductId, updateQuantityByProductId } from "@/data/basket";
import { getProductById } from "@/data/products";
import { currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { formattedPrice } from "@/lib/utils";

export const getBasket = async (courierId?: string) => {
    const user = await currentUser()
    if (!user) return { error: "not_logged_in" }

    let userCart = await prisma.cart.findUnique({ where: { userId: user.id } })
    if (!userCart) userCart = await prisma.cart.create({ data: { userId: user.id, products: [] } })

    if (!userCart) return { error: "User cart not found" }

    // const paymentIntent = await stripe.paymentMethods.retrieve("pm_1OWmHlAoTpKuR4XTM7v7IXQX")
    // console.log(paymentIntent)
    
    const basketProducts = await Promise.all(userCart.products.map(async (cartProduct) => {
        const product = await getProductById(cartProduct.productId)

        return {
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            productDetails: product as ProductItem
        }
    }))

    let shippingCost = 0
    if (courierId) {
        const courier = await prisma.shippingMethod.findUnique({ where: { id: courierId } })
        if (courier) shippingCost = courier.price
    }

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
                value: basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price.price.gross.value, 0),
                currency: "pln",
                formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price.price.gross.value, 0))
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
            totalToPay: { value: basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price.price.gross.value, 0) + shippingCost, currency: "pln", formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price.price.gross.value, 0) + shippingCost) },
        },
        summaryBasket: {
            productsCount: 0,
            worth: {
                gross: { value: basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price.price.gross.value, 0) + shippingCost, currency: "pln", formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price.price.gross.value, 0) + shippingCost) },
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
                size: basketProduct.productDetails.sizes[0].name,
                comment: "",
                availableNow: true,
                additional: "",
                quantity: basketProduct.quantity,
                worth: {
                    gross: {
                        value: basketProduct.quantity * basketProduct.productDetails.price.price.gross.value,
                        currency: "pln",
                        formatted: formattedPrice(basketProduct.quantity * basketProduct.productDetails.price.price.gross.value)
                    },
                    net: {
                        value: basketProduct.quantity * basketProduct.productDetails.price.price.net.value,
                        currency: "pln",
                        formatted: formattedPrice(basketProduct.quantity * basketProduct.productDetails.price.price.net.value)
                    }
                },
                tax: basketProduct.productDetails.price.tax,
                data: basketProduct.productDetails,
                basketGroupId: userCart ? parseInt(userCart.id) : 0,
                versionsName: basketProduct.productDetails.versionName,
                valuesVersionName: "",
                bundleProducts: null
            }
        })
    };    

    return {
        success: true,
        data: basketData
    }
}

export const addToBasket = async (productId: number, quantity: number) => {
    const user = await currentUser()
    if (!user) return { error: "User not logged in" }

    const userCart = await addToBasketByProductId(user.id, productId, quantity)

    if ('error' in userCart) return { error: userCart.error }

    return {
        success: true,
        data: userCart.products
    }
}

export const removeFromBasket = async (productId: number) => {
    const user = await currentUser()
    if (!user) return { error: "User not logged in" }

    const userCart = await removeFromBasketByProductId(user.id, productId)

    if ('error' in userCart) return { error: userCart.error }

    return {
        success: true,
        data: userCart.products
    }
}

export const updateBasket = async (productId: number, quantity: number) => {
    const user = await currentUser()
    if (!user) return { error: "User not logged in" }

    const userCart = await updateQuantityByProductId(user.id, productId, quantity)

    if ('error' in userCart) return { error: userCart.error }

    return {
        success: true,
        data: userCart.products
    }
}