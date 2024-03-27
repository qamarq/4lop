import React from 'react'
import DashboardTitle from '../_components/Title'
import GroupsPageComponent from './_components/GroupsPageComponent'
import { prisma } from '@/lib/db'

export default async function GroupsPage() {
    const groups = await prisma.group.findMany()
    
    return (
        <>
            <DashboardTitle title="Warianty produktów" />
            
            <GroupsPageComponent groups={groups} />
        </>
    )
}
