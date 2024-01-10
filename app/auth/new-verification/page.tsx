import { NewVerificationForm } from '@/components/auth/new-verification-form'
import React from 'react'

export default function EmailVerificationPage() {
    return (    
        <div className='w-full h-full flex items-center justify-center mt-[12rem]'>
            <NewVerificationForm />
        </div>
    )
}
