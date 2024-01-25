import { getPaymentStatus } from "@/actions/payment";
import { prisma } from "@/lib/db"
import { p24 } from "@/lib/p24";
import { Currency, NotificationRequest, Verification } from "@ingameltd/node-przelewy24";
import { orderStatusType } from "@prisma/client";
import { NextResponse } from "next/server";

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
                            orderStatus: paymentStatus.payment.status.toString() == "2" ? orderStatusType.PAID : undefined
                        }
                    })

                    if (paymentStatus.payment.status.toString() == "2" && process.env.P24_SANDBOX_MODE === "true") {
                        order.products.forEach(async (product: any) => {
                            if (!product) return
                            await prisma.products.update({
                                where: {
                                    productId: product.productId
                                },
                                data: {
                                    amount: {
                                        decrement: product.quantity
                                    }
                                }
                            })  
                        })
                    }
                }
            }
        }
    } catch (err) {
        console.error(err)
    }

    return NextResponse.json({ message: "success" }, { status: 200 })
}