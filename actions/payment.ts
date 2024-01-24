"use server"

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

export const getPaymentStatus = async (sessionId: string) => {
    try {
        // const payment = await stripe.paymentIntents.retrieve(paymentId);
        const res = await axiosInstance.get('/transaction/by/sessionId/'+sessionId);
        const response = res.data.data
        // console.log(response)
        const order = await prisma.orders.findFirst({ where: { paymentID: response.description } })

        return { success: true, payment: { status: response.status, orderNumber: order ? order.orderNumber : 0 } }
    } catch (error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}