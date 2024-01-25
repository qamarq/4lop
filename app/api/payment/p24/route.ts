import { getPaymentStatus } from "@/actions/payment";
import { prisma } from "@/lib/db"
import { transporter } from "@/lib/mail";
import { p24 } from "@/lib/p24";
import { stripe } from "@/lib/stripe";
import { Currency, NotificationRequest, Verification } from "@ingameltd/node-przelewy24";
import { orderStatusType } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
	const rawBody = await req.text();

    try {
        const verify: NotificationRequest = JSON.parse(rawBody)
        const res = p24.verifyNotification(verify)
        if (res) {
            const verifyRequest: Verification = {
                amount: verify.amount,
                currency: Currency.PLN,
                orderId: verify.orderId,
                sessionId: verify.sessionId
            }
            
            const verified = await p24.verifyTransaction(verifyRequest)
            if (verified) {
                const order = await prisma.orders.findFirst({ where: { paymentID: verify.sessionId } })
                if (!order) return NextResponse.json({ message: "Order not found" }, { status: 404 })

                const paymentStatus = await getPaymentStatus(verify.sessionId)
                if (paymentStatus.success) {
                    await prisma.orders.update({
                        where: {
                            id: order.id
                        },
                        data: {
                            paymentStatus: paymentStatus.payment.status.toString(),
                            paymentOrderID: paymentStatus.payment.orderId.toString(),
                            paymentStatement: paymentStatus.payment.statement,
                            orderStatus: orderStatusType.PAID
                        }
                    })
                }
            }
        }
    } catch (err) {
        console.error(err)
    }

    return NextResponse.json({ message: "success" }, { status: 200 })
}