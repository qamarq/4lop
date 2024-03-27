"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { formattedPrice } from '@/lib/utils';

const data = [
    {
      name: "Jan",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Feb",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Mar",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Apr",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "May",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Jun",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Jul",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Aug",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Sep",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Oct",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Nov",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
      name: "Dec",
      total: Math.floor(Math.random() * 5000) + 1000,
    },
]

interface MainPageProps {
    statistics: {
        totalEarnings: number;
        totalOrders: number;
        totalProducts: number;
        totalMessages: number;
        lastOrders: {
            id: string;
            orderAmount: number;
            email: string;
            name: string;
        }[];
    };
}

export default function MainPage({ statistics }: MainPageProps) {
    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Dashboard
                </h2>
                <div className="flex items-center space-x-2">
                    {/* <CalendarDateRangePicker /> */}
                    {/* <Button>Download</Button> */}
                </div>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" disabled>
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger value="reports" disabled>
                        Reports
                    </TabsTrigger>
                    <TabsTrigger value="notifications" disabled>
                        Notifications
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-0.5">
                                <CardTitle className="text-sm font-medium">
                                    Całkowity zarobek
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground">
                                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="text-2xl font-bold">
                                    {formattedPrice(statistics.totalEarnings)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    +20.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-0.5">
                                <CardTitle className="text-sm font-medium">
                                    Produkty
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="text-2xl font-bold">
                                    {statistics.totalProducts}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    +180.1% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-0.5">
                                <CardTitle className="text-sm font-medium">
                                    Sprzedaże
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground">
                                    <rect
                                        width="20"
                                        height="14"
                                        x="2"
                                        y="5"
                                        rx="2"
                                    />
                                    <path d="M2 10h20" />
                                </svg>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="text-2xl font-bold">
                                    +{statistics.totalOrders}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    +19% from last month
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-0.5">
                                <CardTitle className="text-sm font-medium">
                                    Wiadomości
                                </CardTitle>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    className="h-4 w-4 text-muted-foreground">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                                <div className="text-2xl font-bold">
                                    {statistics.totalMessages}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    +201 since last hour
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader className='p-4 pb-2'>
                                <CardTitle>Overview</CardTitle>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={data}>
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Bar
                                            dataKey="total"
                                            fill="currentColor"
                                            radius={[4, 4, 0, 0]}
                                            className="fill-primary"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader className='p-4 pb-0.5'>
                                <CardTitle>Ostatnie zamówienia</CardTitle>
                                <CardDescription>
                                    Ogólnie zostało złożone {statistics.totalOrders} zamówień
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='p-4 pt-0.5'>
                                <div className="space-y-4 mt-5">
                                    {statistics.lastOrders.map((order) => (
                                        <div key={order.id} className="flex items-center">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src="/avatars/01.png"
                                                    alt="Avatar"
                                                />
                                                <AvatarFallback>
                                                    {order.name.split(" ").map((name) => name[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {order.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.email}
                                                </p>
                                            </div>
                                            <div className="ml-auto font-medium text-md">
                                                +{formattedPrice(order.orderAmount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}
