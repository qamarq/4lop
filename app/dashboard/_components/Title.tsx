import React from 'react'

export default function DashboardTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
                {title}
            </h2>
        </div>
    )
}
