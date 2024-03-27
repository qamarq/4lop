"use server"

import { prisma } from "@/lib/db";

export const getAllStatistics = async () => {
    const totalMessages = await prisma.contactForm.count();
    const totalProducts = await prisma.product.count();
    const totalOrders = await prisma.orders.count();

    const totalEarnings = await prisma.orders.aggregate({
        _sum: {
            orderAmount: true
        }
    });

    const lastOrders = await prisma.orders.findMany({
        take: 5,
        orderBy: {
            orderDate: 'desc'
        },
        select: {
            id: true,
            userId: true,
            orderAmount: true
        }
    });
    const preparedOrders = await Promise.all(lastOrders.map(async (order) => {
        const user = await prisma.user.findUnique({
            where: {
                id: order.userId
            },
            select: {
                email: true,
                name: true
            }
        });
        return {
            id: order.id,
            orderAmount: order.orderAmount,
            email: user?.email || "",
            name: user?.name || ""
        }
    }));

    return {
        totalEarnings: totalEarnings._sum.orderAmount || 0,
        totalOrders,
        totalProducts,
        totalMessages,
        lastOrders: preparedOrders,
    }
}