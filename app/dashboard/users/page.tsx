import React from 'react'
import { getAllUsers } from '@/actions/users'
import UsersTableComponent from '@/components/dashboard/users/table-users'

export default async function DashboardUsersPage() {
    const usersResponse = await getAllUsers()
    return (
        <>
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Użytkownicy
                </h2>
            </div>

            {usersResponse.success && (
                <UsersTableComponent users={usersResponse.users} />
            )}
        </>
    )
}
