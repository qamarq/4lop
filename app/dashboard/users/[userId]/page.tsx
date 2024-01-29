import UserDashboardRoleComponent from '@/components/dashboard/users/role-select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/db'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

const getUserInfo = async (userId: string) => {
    try {
        const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
        return user
    } catch (error) {
        return null
    }
}

export default async function DashboardUserDetailsPage({ params }: { params: { userId: string } }) {
    const { userId } = params
    const user = await getUserInfo(userId)
    if (!user) return notFound()

    return (
        <div className='pl-3 flex h-[60rem] w-full gap-1'>
            <Card className="grow h-full">
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <Button size={"icon"} variant={"outline"} asChild><Link href="/dashboard/users"><ChevronLeftIcon className='w-4 h-4' /></Link></Button>
                        <div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>Poniżej znajdują się informacje o koncie {user.name}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col'>
                        <div className='flex items-center justify-between space-y-3'>
                            <p className='text-md font-normal'>ID</p>
                            <h1 className='text-md font-semibold'>{user.id}</h1>
                        </div>
                        <div className='flex items-center justify-between space-y-3'>
                            <p className='text-md font-normal'>Imię i nazwisko</p>
                            <h1 className='text-md font-semibold'>{user.name}</h1>
                        </div>
                        <div className='flex items-center justify-between space-y-3'>
                            <p className='text-md font-normal'>Adres email</p>
                            <h1 className='text-md font-semibold'>{user.email}</h1>
                        </div>
                        <div className='flex items-center justify-between space-y-3'>
                            <p className='text-md font-normal'>Weryfikacja email</p>
                            <h1 className='text-md font-semibold'>{user.emailVerified ? <Badge>{user.emailVerified.toLocaleDateString()}</Badge> : <Badge variant={"destructive"}>Brak weryfikacji</Badge>}</h1>
                        </div>
                        <div className='flex items-center justify-between space-y-3'>
                            <p className='text-md font-normal'>Uwierzytelnienie dwuetapowe</p>
                            <h1 className='text-md font-semibold'>{user.isTwoFactorEnabled ? <Badge>Włączona</Badge> : <Badge variant={"destructive"}>Wyłączona</Badge>}</h1>
                        </div>
                        <div className='flex items-center justify-between space-y-3'>
                            <p className='text-md font-normal'>Adres</p>
                            <h1 className='text-md font-semibold'>{user.street} - {user.zipCode} {user.city} - {user.country}</h1>
                        </div>
                        <div className='flex items-center justify-between space-y-3'>
                            <p className='text-md font-normal'>Numer telefonu</p>
                            <h1 className='text-md font-semibold'>{user.phone}</h1>
                        </div>
                        <div className='flex items-center justify-between space-y-3'>
                            <p className='text-md font-normal'>Newsletter</p>
                            <h1 className='text-md font-semibold'>{user.newsletter ? <Badge>Aktywny</Badge> : <Badge variant={"destructive"}>Nieaktywny</Badge>}</h1>
                        </div>
                        <UserDashboardRoleComponent userId={user.id} defaultRole={user.role} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
