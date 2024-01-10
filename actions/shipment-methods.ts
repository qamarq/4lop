"use server"

import { prisma } from "@/lib/db";
import { formattedPrice } from "@/lib/utils";

export const getShipmentMethods = async () => {
    const shipmentMethods = await prisma.shippingMethod.findMany()
    if (!shipmentMethods) return { error: "Shipment methods not found" }

    const shipmentResponse: Shipment[] = await Promise.all(shipmentMethods.map(async (shipmentItem): Promise<Shipment> => {
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
                    days: 1,
                    hours: 1,
                    minutes: 1
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

    return { success: true, shipmentMethods: shipmentResponse }
}