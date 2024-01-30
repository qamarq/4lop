import { getProductDataQuery } from "@/constants";
import { prisma } from "@/lib/db";
import axios from "axios";

export const getProductById = async (productId: number) => {
    let data = JSON.stringify({
        query: getProductDataQuery(productId.toString()),
        variables: {}
    });
      
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.IAI_URL || "",
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };
    
    const response = await axios.request(config)
    const product = response.data.data.product.product as ProductItem

    let productExistsInDB = await prisma.products.findUnique({ where: { productId: product.id } })
    if (!productExistsInDB) {
        productExistsInDB = await prisma.products.create({
            data: {
                productId: product.id,
                productName: product.name,
                priceGrossValue: product.price.price.gross.value,
                priceNetValue: product.price.price.net.value,
                priceGrossFormatted: product.price.price.gross.formatted,
                priceNetFormatted: product.price.price.net.formatted,
                priceTaxValue: product.price.tax.worth.value,
                priceTaxFormatted: product.price.tax.worth.formatted,
                amount: product.sizes[0].amount,
                taxPercent: product.price.tax.vatPercent
            }
        })
    }
        
    if (productExistsInDB) {
        product.price.price.gross.value = productExistsInDB.priceGrossValue
        product.price.price.net.value = productExistsInDB.priceNetValue
        product.price.price.gross.formatted = productExistsInDB.priceGrossFormatted
        product.price.price.net.formatted = productExistsInDB.priceNetFormatted
        product.sizes[0].amount = productExistsInDB.amount
    }
    
    return response.data.data.product.product as ProductItem
}