interface User {
    id: string,     
    firstname: string,
    lastname: string,
    street: string,
    zipCode: string,
    city: string,
    phone: string,
    email: string,
    login: string,
    accountType: string,
    newsletter: boolean
}

interface JwtToken {
    userId: string;
    iat: number;
    exp: number;
}

interface CartItem {
    id: string;
    name: string;
    image: string;
    price: number;
    count: number;
    promotion: number;
}

interface ProductItem {
    id: number,
    code: string,
    name: string,
    link: string,
    versionName: string,
    description: string,
    longDescription: string,
    icon: string,
    price: {
        price: {
            gross: { value: number, currency: string, formatted: string },
            net: { value: number, currency: string, formatted: string }
        },
        omnibusPrice: {
            gross: { value: number, currency: string, formatted: string },
            net: { value: number, currency: string, formatted: string }
        },
        beforeRebate: {
            gross: { value: number, currency: string, formatted: string },
            net: { value: number, currency: string, formatted: string }
        },
        tax: {
            worth: {
                value: number;
                currency: string;
                formatted: string;
            };
            vatPercent: number;
            vatString: string;
        },
        unitConvertedPrice: string;
        rebateNumber: string;
        lastPriceChangeDate: string;
        advancePrice: string;
        promotionDuration: {
            promotionTill: string;
            discountTill: string;
            distinguishedTill: string;
            specialTill: string;
        }
    },
    unit: {
        id: number,
        name: string,
        singular: string,
        plural: string,
        fraction: string,
        sellBy: number,
        precision: number
    },
    producer: {
        id: number,
        name: string,
        link: string,
    },
    category: {
        id: number,
        name: string,
        link: string,
    },
    group: {
        id: number,
        name: string,
        displayAll: boolean,
        link: string,
        versions: {
            icon: string,
            id: number,
            link: string,
            name: string,
        }[],
        groupParameters: {
            id: number,
            name: string,
            values: {
                id: number,
                name: string,
                link: string,
            }[]
        }[],
    },
    opinion: {
        rating: number,
        count: number,
        link: string
    },
    enclosuresImages: {
        position: number,
        type: string,
        url: string,
        width: number,
        height: number,
        iconUrl: string,
        iconWidth: number,
        iconHeight: number,
        mediumUrl: string,
        mediumWidth: number,
        mediumHeight: number,
    }[],
    sizes: {
        id: string,
        name: string,
        code: string,
        amount: number,
        availability: {
            visible: boolean,
            description: string,
            status: string,
            icon: string,
            deliveryDate: any
        },
        shipping: [], //TODO
        price: [], //TODO
        amountWholesale: number
    }[],
    points: number,
    pointsReceiver: number
}

interface GetProductResponse {
    results: { resultCount: number, resultPage: 8, currentPage: number, limitPerPage: number },
    orderBy: { name: string, type: string },
    filtrContext: { name: string, value: number },
    products: ProductItem[],
} 

interface Cart {
    basketCost: {
        shippingUndefined: boolean;
        basketShippingCost: {
            shippingCost: any;
            shippingCostAfterRebate: any;
            shopVat: any;
        };
        prepaidCost: { value: number; currency: string; formatted: string };
        insuranceCost: { value: number; currency: string; formatted: string };
        totalProductsCost: {
            value: number;
            currency: string;
            formatted: string;
        };
        totalAdditionalCost: {
            value: number;
            currency: string;
            formatted: string;
        };
        totalRebate: { value: number; currency: string; formatted: string };
        totalRebateWithoutShipping: {
            value: number;
            currency: string;
            formatted: string;
        };
        totalToPay: { value: number; currency: string; formatted: string };
    };
    summaryBasket: {
        productsCount: number;
        worth: { gross: { value: number; currency: string; formatted: string }; net: { value: number; currency: string; formatted: string } };
        rebate: { value: number; currency: string; formatted: string };
        beforeRebate: { gross: { value: number; currency: string; formatted: string }; net: { value: number; currency: string; formatted: string } };
        shipping: { cost: { value: number; currency: string; formatted: string }; shippingDays: number };
    };
    products: CartProducts[];
}

interface CartProducts {
    id: number,
    size: string,
    comment: string,
    availableNow: boolean,
    additional: string,
    quantity: number,
    worth: {
        gross: {
            value: number,
            currency: string,
            formatted: string
        },
        net: {
            value: number,
            currency: string,
            formatted: string
        }
    },
    tax: {
        worth: {
            value: number,
            currency: string,
            formatted: string
        },
        vatPercent: number,
        vatString: string
    },
    data: ProductItem,
    basketGroupId: number,
    versionsName: string,
    valuesVersionName: string,
    bundleProducts: null
}[]

interface Shipment {
    courier: {
        id: string,
        fullId: string,
        icon: string,
        name: string,
        carrierName: string,
        pickupPoint: boolean,
        companyKey: string,
        companyGroupKey: any
    },
    prepaid: string,
    comment: string,
    excludedProducts: string[],
    availability: string,
    calendar: boolean,
    calendarOption: string,
    minworth: any,
    maxworth: any,
    minworthReached: boolean,
    limitFree: any,
    cost: {
        value: number,
        currency: string,
        formatted: string
    },
    deliveryTime: {
        time: {
            days: number,
            hours: number,
            minutes: number
        },
        workingDays: number,
        weekDay: number,
        weekAmount: number,
        today: boolean
    },
    pointsSelected: boolean,
    pointsCost: any,
    pointsEnabled: boolean,
    workingDays: any,
    courierPickupPoints: any
}

interface ShipmentResponse {
    settings: {
        checked: string,
        orderDivisionEnabled: boolean,
        selectedPickup: {
            id: any,
            codeExternal: any,
            name: any,
            location: any,
            link: any,
            markerIconUrl: any,
            requiredClientNumber: any,
            coordinates: any,
            phone: any,
            address: any,
            openingDays: any,
            daysOff: any,
            pickupTime: any,
            courierId: any
        }
    },
    shipping: Shipment[],
    shippingTime: {
        shippingTime: {
            time: {
                days: number,
                hours: number,
                minutes: number
            },
            workingDays: number,
            weekDay: number,
            weekAmount: number,
            today: boolean
        },
        time: string,
        unknownTime: boolean,
        todayShipmentDeadline: any
    },
    shippingTimeLater: {
        shippingTime: {
            time: any,
            workingDays: number,
            weekDay: number,
            weekAmount: number,
            today: boolean
        },
        time: '',
        unknownTime: boolean,
        todayShipmentDeadline: any
    }
}

interface Payment {
    id: number,
    name: string,
    description: string,
    icon: string,
    icon_svg: string,
    methodAsGroup: boolean,
    paymentChannel: {
        id: string,
        name: string,
        icon: string
    },
    paymentSystem: {
        id: number,
        name: string
    },
    buttonText: string,
    terms: {
        supportsPaymentInitiationService: boolean,
        paymentInitiationServiceTerms: any
    },
    currencyId: string,
    additionalClientCost: {
        costPercent: number,
        costFixedAmount: {
            value: number,
            currency: string,
            formatted: string
        },
        minAmount: {
            value: number,
            currency: string,
            formatted: string
        },
        vatPercent: number
    },
    additionalShopCost: {
        costPercent: number,
        costFixedAmount: {
            value: number,
            currency: string,
            formatted: string
        },
        minAmount: {
            value: number,
            currency: string,
            formatted: string
        },
        vatPercent: number
    }
}

interface PaymentsResponse {
    payments: Payment[],
    paymentsGroup: {
        id: string,
        name: string,
        icon: string
    }[],
    paymentsGroupTerms: [],
    settings: {
        defaultPaymentMethodId: number
    }
}

interface PickupPoint {
    id: string,
    codeExternal: string,
    name: string,
    location: string,
    link: string,
    markerIconUrl: string,
    requiredClientNumber: boolean,
    phone: string | null,
    courierId: number,
    coordinates: {
        latitude: number,
        longitude: number,
        distance: number
    }
}

interface AddonVersion {
    len: number;
    price: number;
    code: number;
    size: string;
}

interface Addon {
    name: string;
    price?: number;
    code?: number;
    size?: string;
    notAvailable?: boolean;
    depedencies?: number[];
    versions?: AddonVersion[];
}

interface Table {
    name: string;
    letter: string;
    path: string;
    thumb: StaticImageData;
    addons: Addon[];
}

interface SavedOrderSettings {
    payment: "prepaid" | null | "dvp",
    delivery: {courierId: string, prepaid: boolean} | null,
    insurance: boolean | null
}

interface OrderOptions {
    payment: "prepaid" | "dvp",
    delivery: {courierId: string, prepaid: boolean, courierName: string},
    insurance: boolean,
    shippingMode: "dvp" | "prepaid",
    selectedPickupPoint: ParcelLocker | null,
    selectedPayment: string
}

interface PaymentForm {
    action: string,
    method: string,
    target: string,
    acceptCharset: string | null,
    inputs: {
        name: string,
        type: string,
        value: string,
        className: string | null,
        url: string | null
    }[]
}

interface Order {
    orderId: string
    orderNumber: number
    status: string
    remarks: string
    timestamp: Date
    checkoutType: string
    worthClientCurrency: {
        value: number
        currency: string
        formatted: string
    }
    client: {
        login: string
        email: string
        phone: string
        billingData: {
            companyName: string
            taxNumber: string
            firstname: string
            lastname: string
            street: string
            zipcode: string
            city: string
            province: string
            countryName: string
        }
        deliveryData: {
            companyName: string
            taxNumber: string
            firstname: string
            lastname: string
            street: string
            zipcode: string
            city: string
            province: string
            countryName: string
        }
    }
    products: {
        worthOrderCurrency?: {
            value: number
            currency: string
            formatted: string
        }
        worthClientCurrency: {
            value: number
            currency: string
            formatted: string
        }
        orderedProducts: [{
            price: any;
            id: number
            name: string
            size: string
            sizeDescription: string
            quantity: number
            unit: string
            link: string
            icon: string
            iconSmall: string
            priceClientCurrency: {
                gross: {
                    value: number
                    currency: string
                    formatted: string
                }
                net: {
                    value: number
                    currency: string
                    formatted: string
                }
            }
        }]
    }
    payment: {
        paymentId: string
        paymentSystemNumber: string
        paymentTimestamp: Date
        status: string
        paymentMethod: {
            id: string
            name: string
            description: string
            icon: string
            refreshPayment: boolean
        }
        bankTransferData: {}
    }
    shipping: {
        costUndefined: boolean
        remarks: string
        costClientCurrency: {
            value: number
            currency: string
            formatted: string
        }
        estimatedDeliveryTime: {
            day: number
            month: number
            year: number
            weekDay: number
            formatted: string
        }
        courier: {
            id: string
            fullId: string
            icon: string
            name: string
            carrierName: string
            pickupPoint: boolean
            companyKey: string
            companyGroupKey: string
        }
        pickupData: {
            id: string
            codeExternal: string
            name: string
            location: string
            link: string
            markerIconUrl: string
            requiredClientNumber: boolean
            phone: string
            courierId: string
            coordinates: {
                latitude: number
                longitude: number
                distance: number
            }
            address: {
                companyName: string
                taxNumber: string
                firstname: string
                lastname: string
                street: string
                zipcode: string
                city: string
                province: string
                countryName: string
            }
        }
    }
    documents: []
}

interface Post {
    title: string
    overview: string
    body: any
    _id: string
    image: string
    author: string
    slug: string
    _createdAt: string
    categories: string[]
}

interface ParcelLocker {
    name: string;
    href: string;
    status: string;
    location: {
        longitude: number;
        latitude: number;
    }
    location_description: string;
    address: {
        line1: string;
        line2: string;
    }
    address_details: {
        city: string;
        province: string;
        post_code: string;
        street: string;
        building_number: string;
        flat_number: string;
    }
    functions: string[];
    image_url: string;
}

declare module 'react-inpost-geowidget';