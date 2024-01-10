"use server"

import { stripe } from "@/lib/stripe";

export const getPaymentStatus = async (paymentId: string) => {
    try {
        const payment = await stripe.paymentIntents.retrieve(paymentId);

        return { success: true, payment: { status: payment.status } }
    } catch (error) {
        console.log(error)
        return { error: "Something went wrong" }
    }
}