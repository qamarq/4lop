import Image from 'next/image'
import React from 'react'
import logo from '@/public/4lop.svg';

export default function LoadingPage() {
    return (
        <div className='w-[100%] h-[100vh] flex items-center justify-center flex-col'>
            <Image src={logo} alt={'4lop logo'} className='w-[300px]' />
            <h1 className='text-slate-700 text-xl mt-[6rem]'>Ładowanie strony...</h1>
        </div>
    )
}
