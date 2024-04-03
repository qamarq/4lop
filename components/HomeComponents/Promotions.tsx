import React from 'react'
import styles from '@/styles/Home.module.scss';
import axios from 'axios';
import { HomeProduct } from '../HomeProduct';
import { v4 } from 'uuid';
import { prisma } from '@/lib/db';
import { createSlugLink } from '@/lib/utils';

const getPromotions = async () => {
    let data = JSON.stringify({
        query: `
            query Products {
                products(
                    settingsInput: {
                        page: 0,
                        limit: 3,
                        filtrContext: { name: promotion }
                    }
                    filterInput: { producers: [1594813770] }
                ) {
                    took
                    products {
                        id
                        type
                        code
                        name
                        versionName
                        description
                        longDescription
                        link
                        zones
                        icon
                        iconSecond
                        iconSmall
                        iconSmallSecond
                        points
                        pointsReceive
                        price {
                            lastPriceChangeDate
                            price {
                                gross {
                                    value
                                    currency
                                    formatted
                                }
                                net {
                                    value
                                    currency
                                    formatted
                                }
                            }
                            tax {
                                vatPercent
                                vatString
                                worth {
                                    value
                                    currency
                                    formatted
                                }
                            }
                        }
                    }
                }
            }
        `,
        variables: {}
    });
      
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.IAI_URL || "",
        headers: { 
            'Content-Type': 'application/json', 
            // 'Cookie': 'client=89f1b5115a991b10ab8ff83aab8326dc'
        },
        data : data
    };
    
    const response = await axios.request(config)
    return { returnData: response.data.data.products }
}

export default async function Promotions({ zones }: { zones: string[] }) {
    // const { returnData } = await getPromotions() as { returnData: { took: number, products: ProductItem[] }}
    // if ("new" in zones) {
    //     const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 3 })

    //     return (
    //         <div className={styles.shop_products}>
    //             {products.map((product) => (
    //                 <HomeProduct 
    //                     key={v4()} 
    //                     id={product.id.toString()} 
    //                     name={product.name} 
    //                     image={product.iconImage} 
    //                     price={product.price} 
    //                     tax={product.taxPercent} 
    //                     cart={true}
    //                     link={createSlugLink(product.name, product.id)}
    //                 /> 
    //             ))}
    //         </div>
    //     )
    // }
    const products = await prisma.product.findMany({
        where: {
            zones: {
                hasSome: zones
            }
        }
    })
    return (
        <div className={styles.shop_products}>
            {products.map((product) => (
                <HomeProduct 
                    key={v4()} 
                    id={product.id.toString()} 
                    name={product.name} 
                    image={product.iconImage} 
                    price={product.price} 
                    tax={product.taxPercent} 
                    cart={true}
                    link={createSlugLink(product.name, product.id)}
                /> 
            ))}
        </div>
    )
}
