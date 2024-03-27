"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Card
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainPageSkeleton() {
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
                            <Skeleton className="h-full w-full" />
                        </Card>
                        <Card>
                            <Skeleton className="h-full w-full" />
                        </Card>
                        <Card>
                            <Skeleton className="w-full h-[133px]" />
                        </Card>
                        <Card>
                            <Skeleton className="h-full w-full" />
                        </Card>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <Skeleton className="w-full h-[423px]" />
                        </Card>
                        <Card className="col-span-3">
                            <Skeleton className="w-full h-full" />
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </>
    )
}
