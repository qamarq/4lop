import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

export default function DashboardUserDetailsPage() {
    return (
        <div className='pl-3 flex h-[60rem] w-full gap-1'>
            <Card className="grow h-full">
                <CardHeader>
                    <CardTitle>Kam Mar</CardTitle>
                    <CardDescription>Poniżej znajdują się informacje o koncie Kam Mar</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
