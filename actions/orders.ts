"use server"

import { getPreparedOrderByOrderId } from "@/data/orders"
import { getProductById } from "@/data/products"
import { currentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { pickupPointData, purchaseDocumentType } from "@prisma/client"

interface createOrderProps {
    deliveryRemarks: string
    remarks: string
    paymentMethodId: string
    courierId: string
    pickupPointId: string
    prepaid: string
    purchaseDocumentType: string
}

export const createOrder = async ({
    deliveryRemarks,
    remarks,
    paymentMethodId,
    courierId,
    pickupPointId,
    prepaid,
    purchaseDocumentType: purchaseDocumentTypeString
}: createOrderProps) => {
    const user = await currentUser()
    if (!user) return { error: "Brak zalogowanego użytkownika" }

    console.log(deliveryRemarks, remarks, paymentMethodId, courierId, pickupPointId, prepaid, purchaseDocumentTypeString)
    const userCart = await prisma.cart.findUnique({ where: { userId: user.id } })
    if (!userCart || userCart.products.length === 0) return { error: "Brak koszyka" }

    const prepaidBool = prepaid === "prepaid" ? true : false

    const basketProducts = await Promise.all(userCart.products.map(async (cartProduct) => {
        const product = await getProductById(cartProduct.productId)

        return {
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            productDetails: product as ProductItem
        }
    }))

    let shippingCost = 0
    let pickupData: pickupPointData | undefined = undefined
    const courier = await prisma.shippingMethod.findUnique({ where: { id: courierId } })
    if (courier) { 
        shippingCost = courier.price
        pickupData = courier.pickupPoint ? {
            id: "",
            codeExternal: "",
            name: "",
            location: "",
            link: "",
            markerIconUrl: "",
            requiredClientNumber: false,
            phone: "",
            courierId: "",
            coordinates: {
                latitude: 0,
                longitude: 0,
                distance: 0,
            },
            address: {
                companyName: "",
                taxNumber: "",
                firstname: "",
                lastname: "",
                street: "",
                zipcode: "",
                city: "",
                province: "",
                countryName: "",
            }
        } : {
            id: "nope",
            codeExternal: "nope",
            name: courier.name,
            location: `Kurier ${courier.name}`,
            link: "nope",
            markerIconUrl: "nope",
            requiredClientNumber: false,
            phone: user.phone,
            courierId: courier.id,
            coordinates: {
                latitude: 0,
                longitude: 0,
                distance: 0,
            },
            address: {
                companyName: "",
                taxNumber: "",
                firstname: user.firstname,
                lastname: user.lastname,
                street: user.street,
                zipcode: user.zipCode,
                city: user.city,
                province: "",
                countryName: user.country,
            }
        }
    }

    const orderAmountTotal = basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price.price.gross.value, 0) + shippingCost

    try {
        let paymentIntent = null
        if (prepaidBool) {
            paymentIntent = await stripe.paymentIntents.create({
                amount: orderAmountTotal*100,
                currency: "pln",
                receipt_email: user.email,
                // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
                // automatic_payment_methods: {
                //     enabled: true,
                // },
                customer: user.stripeCustomerId,
                payment_method_types: ['card', 'p24', 'blik'],
                metadata: {
                    order_id: '0',
                },
            });
        }

        const newOrderNumber = await prisma.orders.count() + 1

        const order = await prisma.orders.create({
            data: {
                userId: user.id,
                prepaid: prepaidBool,
                orderNumber: newOrderNumber,
                orderAddress: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    street: user.street,
                    zipCode: user.zipCode,
                    city: user.city,
                    country: user.country,
                    phone: user.phone,
                    email: user.email || ""
                },
                paymentID: paymentIntent ? paymentIntent.id : null,
                paymentSecret: paymentIntent ? paymentIntent.client_secret : null,
                paymentStatus: paymentIntent ? paymentIntent.status : null,
                paymentCurrency: paymentIntent ? paymentIntent.currency : null,
                orderAmount: orderAmountTotal,
                products: userCart.products,
                shippingMethodId: courierId,
                purchaseDocument: purchaseDocumentTypeString as purchaseDocumentType,
                deliveryRemarks,
                remarks,
                pickupPointId,
                pickupPointData: pickupData
            }
        })

        await stripe.paymentIntents.update(paymentIntent.id, {
            metadata: {
                order_id: order.id,
            },
        })

        await prisma.cart.delete({ where: { userId: user.id } })

        return { success: "Zamówienie zostało utworzone", order: { orderId: order.id, orderNumber: newOrderNumber }, payment: paymentIntent ? { paymentId: paymentIntent.id, paymentSecret: paymentIntent.client_secret } : null }
    } catch (error) {
        console.error(error)
        return { error: "Błąd podczas tworzenia zamówienia" }
    }
}

export const getOrders = async () => {
    const user = await currentUser()
    if (!user) return { error: "Brak zalogowanego użytkownika" }

    const orders = await prisma.orders.findMany({ where: { userId: user.id } })
    
    const preparedOrders: Order[] = await Promise.all(orders.map(async (order) => {
        // const preparedOrder = await Promise.all(order.products.map(async (orderProduct) => {
            
        // }))
        const preparedOrder = await getPreparedOrderByOrderId(order.id)
        return preparedOrder as Order
    }))

    return { orders: preparedOrders.reverse() }
}

export const getOrderByOrderNumber = async (orderNumber: string) => {
    const user = await currentUser()
    if (!user) return { error: "Brak zalogowanego użytkownika" }

    const existingOrder = await prisma.orders.findFirst({ where: { orderNumber: parseInt(orderNumber), userId: user.id } })
    if (!existingOrder) return { error: "Brak zamówienia" }

    const preparedOrder = await getPreparedOrderByOrderId(existingOrder.id)

    return { order: preparedOrder }
}