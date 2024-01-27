import React from 'react'
import styles from "@/styles/Account.module.scss"
import { getAllUsers } from '@/actions/users'
import UsersTableComponent from '@/components/dashboard/users/table-users'

export default async function DashboardUsersPage() {
    const usersResponse = await getAllUsers()
    return (
        <div className={styles.content}>
            <div className='h-full'>
                {usersResponse.success && (
                    <UsersTableComponent users={usersResponse.users} />
                )}
            </div>
        </div>
    )
}
