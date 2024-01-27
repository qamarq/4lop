"use server"

import { Przelewy24PaymentMethod } from "@/constants/payment";
import { currentRole, currentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import axios from "axios";
import { Country, Currency, Encoding, Language, Order as P24Order } from "@ingameltd/node-przelewy24"
import { p24 } from "@/lib/p24"
import { v4 } from "uuid";
import { UserRole, orderStatusType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// import { stripe } from "@/lib/stripe";

const axiosInstance = axios.create({
    baseURL: `https://${process.env.P24_SANDBOX_MODE === "true" ? "sandbox" : "secure"}.przelewy24.pl/api/v1`,
    headers: {
      'Content-Type': 'application/json',
    },
    auth: {
        username: process.env.P24_POS_ID || "",
        password: process.env.P24_API_KEY || "",
    },
});

export const getRefreshPayment = async (orderNumber: string) => {
    try {
        const user = await currentUser()
        if (!user) return { error: "User not found" }

        const order = await prisma.orders.findFirst({ where: { orderNumber: parseInt(orderNumber), userId: user.id } })
        if (!order) return { error: "Order not found" }

        const newSessionId = v4()
        const p24Order: P24Order = {
            sessionId: newSessionId,
            amount: order.orderAmount*100, // Transaction amount expressed in lowest currency unit, e.g. 1.23 PLN = 123
            currency: Currency.PLN,
            description: `Zamówienie ze sklepu 4lop o numerze ${order.orderNumber} - ponowna płatność`,
            email: user.email || "",
            country: Country.Poland,
            language: Language.PL,
            client: `${user.firstname} ${user.lastname}`,
            address: user.street,
            zip: user.zipCode,
            city: user.city,
            phone: user.phone,
            urlReturn: `${process.env.NEXTAUTH_URL}/koszyk/platnosc/podsumowanie?sessionID=${newSessionId}`,
            urlStatus: `https://4lop.pl/api/payment/p24`, // callback to get notification
            timeLimit: 15, // 15min
            encoding: Encoding.UTF8,
        }
        const payment = await p24.createTransaction(p24Order)
        await prisma.orders.update({ where: { id: order.id }, data: { paymentSecret: payment.token, paymentID: newSessionId } })
        return { success: true, paymentLink: payment.link }
    } catch (error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}

export const getPaymentMethods = async () => {
    try {
        const paymentMethordsRaw = await axiosInstance.get('/payment/methods/PL');
        const paymentMethods = paymentMethordsRaw.data.data as Przelewy24PaymentMethod[]

        return { success: true, paymentMethods }
    } catch (error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}

export const getPaymentMethodById = async (id: number) => {
    try {
        const paymentMethodsRaw = await axiosInstance.get('/payment/methods/PL');
        const paymentMethods = paymentMethodsRaw.data.data as Przelewy24PaymentMethod[]

        const paymentMethod = paymentMethods.find((paymentMethod) => paymentMethod.id === id)
        if (!paymentMethod) return { error: "Payment method not found" }

        return { success: true, paymentMethod }
    } catch (error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}

export const getPaymentStatus = async (sessionId: string) => {
    try {
        // const payment = await stripe.paymentIntents.retrieve(paymentId);
        const res = await axiosInstance.get('/transaction/by/sessionId/'+sessionId);
        const response = res.data.data
        // console.log(response)

        const order = await prisma.orders.findFirst({ where: { paymentID: sessionId } })

        return { success: true, payment: { status: response.status, orderNumber: order ? order.orderNumber : 0, paymentMethod: response.paymentMethod, statement: response.statement, orderId: response.orderId } }
    } catch (error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}

export const refundPayment = async (orderId: string) => {
    try {
        const role = await currentRole()
        if (role !== UserRole.ADMIN) return { error: "Access denied" }

        const order = await prisma.orders.findFirst({ where: { id: orderId } })
        if (!order) return { error: "Order not found" }

        if (order.paymentStatus !== "2") return { error: "Order not paid" }

        const refundsUuid = v4()
        const requestId = v4()
        const ref = {
            refundsUuid,
            requestId,
            refunds: [
                {
                    amount: order.orderAmount*100,
                    description: 'Zwrot płatności za zamówienie nr '+order.orderNumber,
                    orderId: Number(order.paymentOrderID),
                    sessionId: order.paymentID || "",
                }
            ],
        }
          
        const result = await p24.refund(ref)
        if (result[0].status === true) {
            await prisma.orders.update({ where: { id: order.id }, data: { 
                paymentStatus: "3",
                refundUUID: refundsUuid,
                refundRequestID: requestId,
                orderStatus: orderStatusType.REFUNDED 
            } })

            //TODO: Wyslij email o zwrocie kasy

            revalidatePath("/dashboard/orders/"+orderId)
            return { success: true }
        } else {
            return { error: "Something went wrong" }
        }
    } catch (error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}