"use server"

import { Przelewy24PaymentMethod } from "@/constants/payment";
import { prisma } from "@/lib/db";
import axios from "axios";

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
        console.log(response)

        const order = await prisma.orders.findFirst({ where: { paymentID: sessionId } })

        return { success: true, payment: { status: response.status, orderNumber: order ? order.orderNumber : 0, paymentMethod: response.paymentMethod, statement: response.statement, orderId: response.orderId } }
    } catch (error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}