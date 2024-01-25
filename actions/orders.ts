"use server"

import { dvpPickupAddress } from "@/constants"
import { getPreparedOrderByOrderId } from "@/data/orders"
import { getProductById } from "@/data/products"
import { currentRole, currentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { UserRole, pickupPointData, purchaseDocumentType } from "@prisma/client"
import { v4 } from "uuid"
import { Country, Currency, Encoding, Language, Order as P24Order } from "@ingameltd/node-przelewy24"
import { p24 } from "@/lib/p24"

interface createOrderProps {
    deliveryRemarks: string
    remarks: string
    paymentMethodId: string
    courierId: string
    pickupPointData: ParcelLocker | null
    prepaid: string
    purchaseDocumentType: string
}

export const getAllOrders = async () => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak uprawnień" }

    const orders = await prisma.orders.findMany({})
    return { success: true, orders }
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

    let everythingOk = true
    userCart.products.forEach(async (product) => {
        const productInDB = await getProductById(product.productId)
        if (productInDB.sizes[0].amount < product.quantity) {
            everythingOk = false
        }
    })
    if (!everythingOk) return { error: "Brak wystarczającej ilości produktów" }

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
        let paymentSessionID = null
        const newOrderNumber = await prisma.orders.count() + 1

        if (prepaidBool) {
            // paymentIntent = await stripe.paymentIntents.create({
            //     amount: orderAmountTotal*100,
            //     currency: "pln",
            //     receipt_email: user.email,
            //     // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            //     // automatic_payment_methods: {
            //     //     enabled: true,
            //     // },
            //     customer: user.stripeCustomerId,
            //     payment_method_types: ['p24'],
            //     metadata: {
            //         order_id: '0',
            //         order_number: '0',
            //     },
            //     shipping: {
            //         address: {
            //             line1: user.street,
            //             postal_code: user.zipCode,
            //             city: user.city,
            //             country: user.country,
            //         },
            //         name: user.name,
            //         carrier: courier ? courier.name : "Brak dostawy",
            //         phone: user.phone,
            //         tracking_number: ""
            //     }
            // });
            paymentSessionID = v4()
            const order: P24Order = {
                sessionId: paymentSessionID,
                amount: orderAmountTotal*100, // Transaction amount expressed in lowest currency unit, e.g. 1.23 PLN = 123
                currency: Currency.PLN,
                description: `Zamówienie ze sklepu 4lop o numerze ${newOrderNumber}`,
                email: user.email || "",
                country: Country.Poland,
                language: Language.PL,
                client: `${user.firstname} ${user.lastname}`,
                address: user.street,
                zip: user.zipCode,
                city: user.city,
                phone: user.phone,
                urlReturn: `${process.env.NEXTAUTH_URL}/koszyk/platnosc/podsumowanie?sessionID=${paymentSessionID}`,
                urlStatus: `https://4lop.pl/api/payment/p24`, // callback to get notification
                timeLimit: 15, // 15min
                encoding: Encoding.UTF8,
            }
            paymentIntent = await p24.createTransaction(order)
        }

        const order = await prisma.orders.create({
            data: {
                userId: user.id,
                buyerEmail: user.email || "",
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
                paymentID: paymentIntent ? paymentSessionID : null,
                paymentSecret: paymentIntent ? paymentIntent.token : null,
                paymentStatus: prepaidBool ? "0" : "2",
                paymentCurrency: "pln",
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

        // if (prepaidBool) {
        //     await stripe.paymentIntents.update(paymentIntent.id, {
        //         metadata: {
        //             order_id: order.id,
        //             order_number: order.orderNumber
        //         },
        //     })
        // }

        await prisma.cart.delete({ where: { userId: user.id } })

        return { success: "Zamówienie zostało utworzone", order: { orderId: order.id, orderNumber: newOrderNumber }, payment: paymentIntent ? { link: paymentIntent.link } : null }
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

export const getOrderByOrderIdAsAdmin = async (orderId: string) => {
    const user = await currentUser()
    const role = await currentRole()
    if (!user) return { error: "Brak zalogowanego użytkownika" }
    if (role !== UserRole.ADMIN) return { error: "Brak uprawnień" }

    const preparedOrder = await getPreparedOrderByOrderId(orderId)

    return { order: preparedOrder }
}