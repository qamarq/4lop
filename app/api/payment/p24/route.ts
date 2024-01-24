import { prisma } from "@/lib/db"
import { transporter } from "@/lib/mail";
import { p24 } from "@/lib/p24";
import { stripe } from "@/lib/stripe";
import { NotificationRequest } from "@ingameltd/node-przelewy24";
import { orderStatusType } from "@prisma/client";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: Request) {
	const rawBody = await req.text();

    console.log(rawBody)

    const mailOptions = {
        from: '4lop <noreply@4lop.pl>',
        to: "kamilm@you2.pl",
        subject: "New Payment - 4lop",
        text: `${rawBody}`
    };
      
    transporter.sendMail(mailOptions);

    try {
        const verify: NotificationRequest = JSON.parse(rawBody)
        const res = p24.verifyNotification(verify)

        if (res) {

        }
    } catch (err) {
        console.error(err)
    }

    return NextResponse.json({ message: "success" }, { status: 200 })
}