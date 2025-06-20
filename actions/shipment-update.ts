"use server";

import { z } from "zod"
import { prisma } from "@/lib/db"
import { BasicShipmentSchema } from "@/schemas";
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateShipmentOrder = async (shipmentList: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    description: string;
    excludedProducts: string[];
    pickupPoint: boolean;
    companyKey: string | null;
    prepaid: boolean;
    excluding: boolean;
    personalCollection: boolean;
    shippingTimeDays: number;
    shippingInWeekends: boolean;
}[] ) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak autoryzacji" }

    // console.log(shipmentList)
    // return { success: "Zaktualizowano kolejność metod wysyłki" }

    try {
        // await prisma.shippingMethod.deleteMany()
        // for (const shipment of shipmentList) {
        //     await prisma.shippingMethod.create({
        //         data: shipment
        //     })
        // }
        let i = 0
        for (const shipment of shipmentList) {
            i++
            await prisma.shippingMethod.update({
                where: { id: shipment.id },
                data: { numberInOrder: i } 
            })
        }

        // revalidatePath("/dashboard/shipments")
        return { success: "Zaktualizowano kolejność metod wysyłki" }
    } catch (err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}

export const deleteShipmentById = async (id: string) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak autoryzacji" }

    try {
        await prisma.shippingMethod.delete({ where: { id } })
        revalidatePath("/dashboard/shipments")
        return { success: "Usunięto metodę wysyłki" }
    } catch (err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}

export const updateBasicShipmentData = async (id: string | null, value: z.infer<typeof BasicShipmentSchema>) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak autoryzacji" }

    const parsedData = BasicShipmentSchema.safeParse(value)
    if (!parsedData.success) return { error: parsedData.error.issues[0].message }

    const values = {
        ...parsedData.data,
        price: parseFloat(parsedData.data.price),
        shippingTimeDays: parseInt(parsedData.data.shippingTimeDays)
    }

    try {
        if (id) {
            await prisma.shippingMethod.update({
                where: { id },
                data: { ...values }
            })
            revalidatePath("/dashboard/shipments")
            revalidatePath(`/dashboard/shipments/${id}`)
            return { success: "Zaktualizowano metodę wysyłki" }
        } else {
            const countShippingMethods = await prisma.shippingMethod.count()
            const addedMethod = await prisma.shippingMethod.create({
                data: { ...values, numberInOrder: countShippingMethods + 1 }
            })
            revalidatePath("/dashboard/shipments")
            return { redirect: `/dashboard/shipments/${addedMethod.id}` }
        }
    } catch (err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}