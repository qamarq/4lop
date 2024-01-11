"use server"

import { dvpPickupAddress } from "@/constants"
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
    pickupPointData: ParcelLocker | null
    prepaid: string
    purchaseDocumentType: string
}

export const createOrder = async ({
    deliveryRemarks,
    remarks,
    paymentMethodId,
    courierId,
    pickupPointData,
    prepaid,
    purchaseDocumentType: purchaseDocumentTypeString
}: createOrderProps) => {
    const user = await currentUser()
    if (!user) return { error: "Brak zalogowanego użytkownika" }

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
        if (courier.pickupPoint && pickupPointData) {
            pickupData = {
                id: pickupPointData.name,
                codeExternal: pickupPointData.name,
                name: pickupPointData.name,
                location: pickupPointData.location_description,
                link: pickupPointData.href,
                markerIconUrl: pickupPointData.image_url,
                requiredClientNumber: false,
                phone: "",
                courierId: "InPostShipX",
                coordinates: {
                    latitude: pickupPointData.location.latitude,
                    longitude: pickupPointData.location.longitude,
                    distance: 10,
                },
                address: {
                    companyName: pickupPointData.name,
                    taxNumber: "",
                    firstname: "",
                    lastname: "",
                    street: `${pickupPointData.address_details.street}${pickupPointData.address_details.building_number ? ` ${pickupPointData.address_details.building_number}` : ""}`,
                    zipcode: pickupPointData.address_details.post_code,
                    city: pickupPointData.address_details.city,
                    province: pickupPointData.address_details.province,
                    countryName: "PL",
                }
            }
        } else {
            if (courier.personalCollection === true) {
                pickupData = {
                    id: "personalCollection",
                    codeExternal: "personalCollection",
                    name: courier.name,
                    location: "",
                    link: "",
                    markerIconUrl: "",
                    requiredClientNumber: false,
                    phone: dvpPickupAddress.contact.phone,
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
                        street: dvpPickupAddress.street,
                        zipcode: dvpPickupAddress.postal_code,
                        city: dvpPickupAddress.city,
                        province: "",
                        countryName: "PL",
                    }
                }
            } else {
                pickupData = {
                    id: "nope",
                    codeExternal: "nope",
                    name: courier.name,
                    location: courier.name,
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
                    order_number: '0',
                },
                shipping: {
                    address: {
                        line1: user.street,
                        postal_code: user.zipCode,
                        city: user.city,
                        country: user.country,
                    },
                    name: user.name,
                    carrier: courier ? courier.name : "Brak dostawy",
                    phone: user.phone,
                    tracking_number: ""
                }
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
                pickupPointId: pickupPointData ? pickupPointData.name : undefined,
                pickupPointData: pickupData
            }
        })

        if (prepaidBool) {
            await stripe.paymentIntents.update(paymentIntent.id, {
                metadata: {
                    order_id: order.id,
                    order_number: order.orderNumber
                },
            })
        }

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