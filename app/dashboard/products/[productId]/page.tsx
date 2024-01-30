import { getProductByIdAdmin } from '@/actions/products'
import EditProductsForm from '@/components/dashboard/products/edit-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { currentRole } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

const getProductInfo = async (productId: string) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { error: true, message: "You don't have permission to access this page" }

    const productResponse = await prisma.products.findUnique({ where: { id: productId } })
    if (!productResponse) return { error: true, message: "Product not found" }

    return { success: true, product: productResponse }
}

export default async function ProductDetailsPageDashboard({ params }: { params: { productId: string } }) {
    const { productId } = params
    const productResponse = await getProductInfo(productId)
    if (productResponse.error || !productResponse.success) return notFound()

    const { product } = productResponse

    return (
        <div className='sm:pl-3 pl-0 sm:flex-row flex-col flex h-[60rem] w-full gap-1'>
            <Card className="grow h-full">
                <CardHeader>
                    <div className='flex items-center gap-2'>
                        <Button size={"icon"} variant={"outline"} asChild><Link href="/dashboard/products"><ChevronLeftIcon className='w-4 h-4' /></Link></Button>
                        <div>
                            <CardTitle className=''>{product.productName}</CardTitle>
                            <CardDescription>Poniżej znajdują się informacje o produkcie o kodzie <span className='font-semibold'>{product.productId}</span></CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col'>
                        <div className='flex items-center justify-between mb-3'>
                            <p className='text-md font-normal'>Kod produktu</p>
                            <h1 className='text-md font-semibold'>{product.productId}</h1>
                        </div>
                        <div className='flex items-center justify-between mb-3'>
                            <p className='text-md font-normal'>ID w sklepie</p>
                            <h1 className='text-md font-semibold'>{product.id}</h1>
                        </div>
                        <div className='flex items-center justify-between mb-3'>
                            <p className='text-md font-normal'>Nazwa produktu</p>
                            <h1 className='text-md font-semibold truncate max-w-[400px]'>{product.productName}</h1>
                        </div>
                        <div className='flex items-center justify-between mb-3'>
                            <p className='text-md font-normal'>Dostępność</p>
                            <h1 className='text-md font-semibold'><Badge variant={product.amount === 0 ? "destructive" : "outline"}>{product.amount} szt.</Badge></h1>
                        </div>
                        <Separator className='my-3' />
                        <div className='flex items-center justify-between mb-3'>
                            <p className='text-md font-normal'>Cena (netto)</p>
                            <h1 className='text-md font-semibold'>{product.priceNetFormatted}</h1>
                        </div>
                        <div className='flex items-center justify-between mb-3'>
                            <p className='text-md font-normal'>Cena (brutto)</p>
                            <h1 className='text-md font-semibold'>{product.priceGrossFormatted}</h1>
                        </div>
                        <div className='flex items-center justify-between mb-3'>
                            <p className='text-md font-normal'>Podatek (VAT)</p>
                            <h1 className='text-md font-semibold'>{product.taxPercent}% ({product.priceTaxFormatted})</h1>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className='min-w-[300px]'>
                <CardHeader>
                    <CardTitle>Edytuj produkt</CardTitle>
                    <CardDescription>Edytuj produkt o kodzie <span className='font-semibold'>{product.productId}</span></CardDescription>
                </CardHeader>
                <CardContent>
                    <EditProductsForm product={product} />
                </CardContent>
            </Card>
        </div>
    )
}
