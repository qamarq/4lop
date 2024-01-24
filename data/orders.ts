import { currentUser } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formattedPrice } from "@/lib/utils"
import { getProductById } from "./products"
import { paymentOptions, paymentOptionsIcons } from "@/constants/payment"
import { getPaymentMethodById, getPaymentStatus } from "@/actions/payment"

export const getPreparedOrderByOrderId = async (orderId: string) => {
    const order = await prisma.orders.findUnique({ where: { id: orderId } })
    if (!order) return
    const user = await currentUser()
    if (!user) return 

    const userHasOrder = await prisma.orders.findFirst({ where: { id: orderId, userId: user.id } })
    if (!userHasOrder) return

    let paymentMethod = null

    if (order.paymentID) {
        const paymentStatus = await getPaymentStatus(order.paymentID)
        if (paymentStatus.success) {
            const getPaymentResponse = await getPaymentMethodById(paymentStatus.payment.paymentMethod)
            if (getPaymentResponse.success) paymentMethod = getPaymentResponse.paymentMethod
        }
    }

    let shippingCost = 0
    const courier = await prisma.shippingMethod.findUnique({ where: { id: order.shippingMethodId || "" } })

    if (courier) shippingCost = courier.price

    const basketProducts = await Promise.all(order.products.map(async (cartProduct: any) => {
        const product = await getProductById(cartProduct.productId)

        return {
            productId: cartProduct.productId,
            quantity: cartProduct.quantity,
            productDetails: product as ProductItem
        }
    }))

    const preparedOrder: Order = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.orderStatus,
        remarks: order.remarks,
        timestamp: order.orderDate,
        checkoutType: "",
        worthClientCurrency: {
            value: order.orderAmount,
            currency: "pln",
            formatted: formattedPrice(order.orderAmount)
        },
        client: {
            login: "",
            email: user.email || "",
            phone: user.phone || "",
            billingData: {
                companyName: "",
                taxNumber: "",
                firstname: user.firstname,
                lastname: user.lastname,
                street: user.street,
                zipcode: user.zipCode,
                city: user.city,
                province: "",
                countryName: user.country
            },
            deliveryData: {
                companyName: "",
                taxNumber: "",
                firstname: user.firstname,
                lastname: user.lastname,
                street: user.street,
                zipcode: user.zipCode,
                city: user.city,
                province: "",
                countryName: user.country
            }
        },
        products: {
            worthClientCurrency: {
                value: basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price.price.gross.value, 0),
                currency: "pln",
                formatted: formattedPrice(basketProducts.reduce((acc, curr) => acc + curr.quantity * curr.productDetails.price.price.gross.value, 0))
            },
            orderedProducts: basketProducts.map((basketProduct) => { return { ...basketProduct.productDetails, quantity: basketProduct.quantity } }) as any,
        },
        payment: {
            paymentId: order ? order.paymentID || "" : "dvp",
            paymentSystemNumber: order ? order.paymentID || "" : "dvp",
            paymentTimestamp: order.orderDate,
            status: order.paymentStatus || "dvp",
            paymentMethod: {
                id: paymentMethod ? paymentMethod.id.toString() : "dvp",
                name: paymentMethod ? paymentMethod.name : "Płatność za pobraniem",
                description: "",
                icon: paymentMethod ? paymentMethod.imgUrl : paymentOptionsIcons["dvp"],
                refreshPayment: false,
            },
            bankTransferData: {}
        },
        shipping: {
            costUndefined: false,
            remarks: order.remarks,
            costClientCurrency: {
                value: shippingCost,
                currency: "pln",
                formatted: formattedPrice(shippingCost)
            },
            estimatedDeliveryTime: {
                day: 0,
                month: 0,
                year: 0,
                weekDay: 0,
                formatted: "{}"
            },
            courier: {
                id: courier ? courier.id : "nope",
                fullId: courier ? courier.id : "nope",
                icon: courier ? courier.image || "" : "nope",
                name: courier ? courier.name : "nope",
                carrierName: courier ? courier.name : "nope",
                pickupPoint: order.pickupPointId ? true : false,
                companyKey: courier ? courier.companyKey || "" : "nope",
                companyGroupKey: courier ? courier.companyKey || "" : "nope"
            },
            pickupData: {
                id: order.pickupPointData?.id || "nope",
                codeExternal: order.pickupPointData?.codeExternal || "nope",
                name: order.pickupPointData?.name || "nope",
                location: order.pickupPointData?.location || "nope",
                link: order.pickupPointData?.link || "nope",
                markerIconUrl: order.pickupPointData?.markerIconUrl || "nope",
                requiredClientNumber: order.pickupPointData?.requiredClientNumber || false,
                phone: order.pickupPointData?.phone || "nope",
                courierId: order.pickupPointData?.courierId || "nope",
                coordinates: {
                    latitude: order.pickupPointData?.coordinates.latitude || 0,
                    longitude: order.pickupPointData?.coordinates.longitude || 0,
                    distance: order.pickupPointData?.coordinates.distance || 0
                },
                address: {
                    companyName: order.pickupPointData?.address.companyName || "nope",
                    taxNumber: order.pickupPointData?.address.taxNumber || "nope",
                    firstname: order.pickupPointData?.address.firstname || "nope",
                    lastname: order.pickupPointData?.address.lastname || "nope",
                    street: order.pickupPointData?.address.street || "nope",
                    zipcode: order.pickupPointData?.address.zipcode || "nope",
                    city: order.pickupPointData?.address.city || "nope",
                    province: order.pickupPointData?.address.province || "nope",
                    countryName: order.pickupPointData?.address.countryName || "nope"
                }
            }
        },
        documents: []
    }

    return preparedOrder
}