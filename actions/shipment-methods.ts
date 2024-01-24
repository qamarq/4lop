"use server"

import { prisma } from "@/lib/db";
import { p24 } from "@/lib/p24";
import { formattedPrice } from "@/lib/utils";
import { P24, P24Error } from "@ingameltd/node-przelewy24";
import nodemailer from "nodemailer"

export const getShipmentMethods = async () => {
    const shipmentMethods = await prisma.shippingMethod.findMany()
    if (!shipmentMethods) return { error: "Shipment methods not found" }

    const shipmentResponse: Shipment[] = await Promise.all(shipmentMethods.map(async (shipmentItem): Promise<Shipment> => {
        let deliveryDays = 0
        let deliveryHours = 0
        let deliveryMinutes = 0

        const shippingTimeDays = shipmentItem.shippingTimeDays
        const shippingInWeekends = shipmentItem.shippingInWeekends

        if (shippingInWeekends) {
            deliveryHours = 48
        } else {
            const currentDate = new Date()
            const currentDay = currentDate.getDay()
            const daysToAdd = shippingTimeDays + Math.floor((currentDay + shippingTimeDays) / 5) * 2
            const deliveryDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
            deliveryDays = Math.floor(daysToAdd)
            deliveryHours = deliveryDate.getHours()
            deliveryMinutes = deliveryDate.getMinutes()
        }

        return {
            courier: {
                id: shipmentItem.id,
                fullId: shipmentItem.id,
                icon: shipmentItem.image || "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?v=1530129081",
                name: shipmentItem.name,
                carrierName: shipmentItem.name,
                pickupPoint: shipmentItem.pickupPoint,
                companyKey: shipmentItem.companyKey || "default",
                companyGroupKey: shipmentItem.companyKey || "default",
            },
            prepaid: shipmentItem.prepaid ? "prepaid" : "dvp",
            comment: shipmentItem.description,
            excludedProducts: shipmentItem.excludedProducts || [],
            availability: "",
            calendar: false,
            calendarOption: "",
            minworth: shipmentItem.minWorth,
            maxworth: shipmentItem.maxWorth,
            minworthReached: true,
            limitFree: false,
            cost: {
                value: shipmentItem.price,
                currency: "pln",
                formatted: formattedPrice(shipmentItem.price)
            },
            deliveryTime: {
                time: {
                    days: deliveryDays,
                    hours: deliveryHours,
                    minutes: deliveryMinutes
                },
                workingDays: 1,
                weekDay: 1,
                weekAmount: 1,
                today: false
            },
            pointsSelected: false,
            pointsCost: 1,
            pointsEnabled: false,
            workingDays: 1,
            courierPickupPoints: false
        }
    }))

    // try {
    //     const result = await p24.testAccess();
    //     console.log(result);
    // } catch (err) {
    //     if (err instanceof P24Error) {
    //         console.log("hahahah")
    //         console.log(err.message);
    //     }
    //     console.log(typeof err)
    //     console.log(err)
    // }

    // try {
    //     const result = await p24.testAccess();
    //     console.log(result);
    // } catch (err) {
    //     console.log(err)
    // }

    return { success: true, shipmentMethods: shipmentResponse }
}