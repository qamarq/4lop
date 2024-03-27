import React from 'react'
import { getAllUsers } from '@/actions/users'
import UsersTableComponent from '@/components/dashboard/users/table-users'
import DashboardTitle from '../_components/Title'

export default async function DashboardUsersPage() {
    const usersResponse = await getAllUsers()
    return (
        <>
            <DashboardTitle title="Użytkownicy" />

            {usersResponse.success && (
                <UsersTableComponent users={usersResponse.users} />
            )}
        </>
    )
}
