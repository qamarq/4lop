import { prisma } from "@/lib/db"

export const getProductFromCart = async (userId: string, productId: number) => {
    const data = await prisma.cart.findFirst({
        where: {
            userId: userId,
            products: {
                some: {
                    productId,
                },
            },
        }
    })

    return data
}

export const addToBasketByProductId = async (userId: string, productId: number, quantity: number) => {
    let userCart = await prisma.cart.findUnique({ where: { userId: userId } })
    if (!userCart) {
        userCart = await prisma.cart.create({ data: { userId: userId } })
    }

    // const productExistsInDB = await prisma.products.findUnique({ where: { productId } })
    // let product = await getProductById(productId)
    

    // if (productExistsInDB) {
    //     product.price.price.gross.value = productExistsInDB.priceGrossValue
    //     product.price.price.net.value = productExistsInDB.priceNetValue
    //     product.price.price.gross.formatted = productExistsInDB.priceGrossFormatted
    //     product.price.price.net.formatted = productExistsInDB.priceNetFormatted
    // }
    const productExistsInDB = await prisma.products.findUnique({ where: { productId } })
    if (!productExistsInDB) return { error: "Product not found" }

    const productExistInCart = await getProductFromCart(userId, productId)
    if (!productExistInCart) {
        if (quantity > productExistsInDB.amount) return { error: "Not enough products in stock" }
        userCart = await prisma.cart.update({
            where: { userId: userId },
            data: {
                products: {
                    push: [
                        {
                            productId: productId,
                            quantity: quantity,
                        },
                    ],
                },
            },
        })
    } else {
        let notEnoughProducts = false
        const cartItems = userCart.products.map((cartProduct) => {
            if (cartProduct.productId === productId) {
                if ((cartProduct.quantity + quantity) > productExistsInDB.amount) {
                    notEnoughProducts = true
                    return cartProduct
                }
                return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity,
                };
            } else return cartProduct;
        });

        if (notEnoughProducts) return { error: "Brak wystarczającej ilości w magazynie" }

        userCart = await prisma.cart.update({
            where: { userId: userId },
            data: {
                products: {
                    set: cartItems,
                },
            },
        });
    }

    return userCart
}

export const removeFromBasketByProductId = async (userId: string, productId: number) => {
    const userCart = await prisma.cart.findUnique({ where: { userId: userId } })
    if (!userCart) {
        return { error: "User cart not found" }
    }

    const cartItems = userCart.products.filter((cartProduct) => cartProduct.productId !== productId)

    await prisma.cart.update({
        where: { userId: userId },
        data: {
            products: {
                set: cartItems,
            },
        },
    })

    return userCart
}

export const updateQuantityByProductId = async (userId: string, productId: number, quantity: number) => {
    const userCart = await prisma.cart.findUnique({ where: { userId: userId } })
    if (!userCart) {
        return { error: "User cart not found" }
    }

    const productExistsInDB = await prisma.products.findUnique({ where: { productId } })
    if (!productExistsInDB) return { error: "Product not found" }

    if (quantity > productExistsInDB.amount) return { error: "Not enough products in stock" }

    const cartItems = userCart.products.map((cartProduct) => {
        if (cartProduct.productId === productId) {
          return {
            ...cartProduct,
            quantity: quantity,
          };
        } else return cartProduct;
    });

    await prisma.cart.update({
        where: { userId: userId },
        data: {
            products: {
                set: cartItems,
            },
        },
    })

    return userCart
}