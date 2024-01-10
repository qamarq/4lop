import { prisma } from "@/lib/db"
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
const resend = new Resend(process.env.RESEND_API);

export async function POST(req: Request) {
	const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } catch (err: any) {
        console.log(err.message)
        return NextResponse.json({ message: err.message }, { status: 500 })
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            await prisma.orders.findFirst({
                where: {
                    paymentID: paymentIntentSucceeded.id
                }
            }).then(async (ticket) => {
                if (ticket) {
                    await prisma.orders.update({
                        where: {
                            id: ticket.id
                        },
                        data: {
                            paymentStatus: paymentIntentSucceeded.status
                        }
                    })

                    // try {
                    //     const { data, error } = await resend.emails.send({
                    //         from: 'FAJ TEST MAIL <onboarding@resend.dev>',
                    //         to: [paymentIntentSucceeded.receipt_email],
                    //         reply_to: 'kontakt@faj.org.pl',
                    //         subject: 'New ticket buyed - TEST MAIL',
                    //         html: `<p>New message from <strong>FAJ: New ticket buyed</strong><br/><strong>Status</strong>: ${paymentIntentSucceeded.status}<br/><strong>Amount</strong>: ${paymentIntentSucceeded.amount/100} EUR<br/><strong>Payment ID</strong>: ${paymentIntentSucceeded.id}</p>`,
                    //     });

                    //     console.log(data, error)
                    // } catch (err: any) {

                    // }
                    console.log("TODO: Send email confirmation")
                }
            
            })
            break;

        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            await prisma.orders.findFirst({
                where: {
                    paymentID: paymentIntentFailed.id
                }
            }).then(async (ticket) => {
                if (ticket) {
                    await prisma.orders.update({
                        where: {
                            id: ticket.id
                        },
                        data: {
                            paymentStatus: paymentIntentFailed.status
                        }
                    })
                }
            
            })
            break;

        case 'payment_intent.processing':
            const paymentIntentProcessing = event.data.object;
            await prisma.orders.findFirst({
                where: {
                    paymentID: paymentIntentProcessing.id
                }
            }).then(async (ticket) => {
                if (ticket) {
                    await prisma.orders.update({
                        where: {
                            id: ticket.id
                        },
                        data: {
                            paymentStatus: paymentIntentProcessing.status
                        }
                    })
                }
            
            })
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ message: "success" }, { status: 200 })
}