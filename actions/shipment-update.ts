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
    minWorth: number;
    maxWorth: number;
    personalCollection: boolean;
    shippingTimeDays: number;
    shippingInWeekends: boolean;
}[] ) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: "Brak autoryzacji" }

    // console.log(shipmentList)
    // return { success: "Zaktualizowano kolejność metod wysyłki" }

    try {
        await prisma.shippingMethod.deleteMany()
        for (const shipment of shipmentList) {
            const { id, ...toInsert } = shipment
            await prisma.shippingMethod.create({
                data: {
                    ...toInsert
                }
            })
        }

        revalidatePath("/dashboard/shipments")
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
        maxWorth: parseFloat(parsedData.data.maxWorth),
        minWorth: parseFloat(parsedData.data.minWorth),
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
            const addedMethod = await prisma.shippingMethod.create({
                data: { ...values }
            })
            revalidatePath("/dashboard/shipments")
            return { redirect: `/dashboard/shipments/${addedMethod.id}` }
        }
    } catch (err) {
        console.log(err)
        return { error: "Coś poszło nie tak!" }
    }
}