"use client"

import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { UserRole } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Loader2Icon, SaveIcon } from 'lucide-react'
import { updateRole } from '@/actions/users'
import { toast } from '@/components/ui/use-toast'

export default function UserDashboardRoleComponent({ userId, defaultRole }: { userId: string, defaultRole: UserRole }) {
    const [role, setRole] = React.useState(defaultRole)
    const [isPending, startTransition] = React.useTransition()

    const updateRoleRequest = async () => {
        startTransition(async () => {
            await updateRole(userId, role)
                .then(data => {
                    if (data.success) {
                        toast({
                            title: "Pomyślnie zaktualizowano rolę użytkownika",
                        })
                    } else {
                        toast({
                            title: "Wystąpił błąd podczas aktualizacji roli użytkownika",
                            variant: "destructive",
                        })
                    }
                })
        })
    }

    return (
        <div className='flex items-center justify-between rounded-lg border p-3 shadow-sm w-full mt-3'>
            <div className='space-y-0.5'>
                <p className='font-semibold text-md'>Rola użytkownika</p>
                <p className='text-xs'>Tutaj możesz zmienić role danego użytkownika</p>
            </div>

            <div className='flex items-center gap-1'>
                <Select value={role} onValueChange={setRole as any}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Wybierz rolę" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(UserRole).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button onClick={updateRoleRequest} disabled={defaultRole === role || isPending} variant={"default"} size={"icon"}>{isPending ? <Loader2Icon className='w-4 h-4 animate-spin' /> : <SaveIcon className='w-4 h-4' />}</Button>
            </div>
        </div>
    )
}
