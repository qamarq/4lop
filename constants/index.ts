import Image1 from "@/public/configurator/stol_podst/jpg/A.jpg"
import Image2 from "@/public/configurator/stol_warsztat/jpg/B.jpg"
import Image3 from "@/public/configurator/stol_nozem/jpg/C.jpg"

export const COOKIE_SESSION_KEY_NAME = '4lopSessionKey';
export const LOCALSTORAGE_CART_KEY_NAME = '4lopCart';
export const LOCALSTORAGE_TMPCART_KEY_NAME = '4lopCartNotEnough';
export const COOKIE_CLIENT_ID = "4lopClientId";
// export const COOKIE_CLIENT_ID = "4lopToken";
export const MAX_AGE = 60 * 60 * 24
export const SAVED_ORDER_SETTINGS_NAME = "4lopSavedOrderSettings";

/**
 * Adres odbioru osobistego firmy 4lop. Znajdziesz w "@/constants/index.ts"
 */
export const dvpPickupAddress = {
    name: "Siedziba 4lop",
    street: "ul. Żółkiewskiego 12",
    city: "Toruń",
    postal_code: "87-100",
    contact: {
        phone: "+48 519 653 388",
        email: "kontakt@4lop.pl"
    }
}

export const getProductDataQuery = (id: string) => {
    return(`{
        product(productId: ${id}) {
          product {
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
            price {
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
              omnibusPrice {
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
                worth {
                  value
                  currency
                  formatted
                }
                vatPercent
                vatString
              }
              beforeRebate {
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
              crossedPrice {
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
              youSave {
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
              unit {
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
              max {
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
              suggested {
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
              unitConvertedPrice {
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
              rebateNumber {
                number
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
                allThresholds {
                  percent
                  firstThresholdValue
                  endThresholdValue
                  points {
                    value
                    formatted
                  }
                  thresholdDiff
                  minQuantity
                  priceAfterRebate {
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
                  products {
                    id
                  }
                }
              }
              lastPriceChangeDate
              advancePrice {
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
              promotionDuration {
                promotionTill {
                  date {
                    day
                    month
                    year
                    weekDay
                    formatted
                  }
                  time {
                    hour
                    minutes
                    seconds
                  }
                  timestamp
                }
                discountTill {
                  date {
                    day
                    month
                    year
                    weekDay
                    formatted
                  }
                  time {
                    hour
                    minutes
                    seconds
                  }
                  timestamp
                }
                distinguishedTill {
                  date {
                    day
                    month
                    year
                    weekDay
                    formatted
                  }
                  time {
                    hour
                    minutes
                    seconds
                  }
                  timestamp
                }
                specialTill {
                  date {
                    day
                    month
                    year
                    weekDay
                    formatted
                  }
                  time {
                    hour
                    minutes
                    seconds
                  }
                  timestamp
                }
              }
            }
            unit {
              id
              name
              singular
              plural
              fraction
              sellBy
              precision
            }
            producer {
              id
              name
              link
            }
            category {
              id
              name
              link
            }
            group {
              id
              name
              displayAll
              link
              versions {
                id
                name
                icon
                iconSecond
                iconSmall
                iconSmallSecond
                productIcon
                productIconSecond
                productIconSmall
                productIconSmallSecond
                link
                parameterValues {
                  id
                  name
                  link
                  search {
                    icon
                    desktop
                    tablet
                    mobile
                  }
                  projector {
                    icon
                    desktop
                    tablet
                    mobile
                  }
                }
              }
              groupParameters {
                id
                name
                values {
                  id
                  name
                  link
                  search {
                    icon
                    desktop
                    tablet
                    mobile
                  }
                  projector {
                    icon
                    desktop
                    tablet
                    mobile
                  }
                }
                contextValue
                search {
                  icon
                  desktop
                  tablet
                  mobile
                }
                projector {
                  icon
                  desktop
                  tablet
                  mobile
                }
              }
            }
            opinion {
              rating
              count
              link
            }
            enclosuresImages {
              position
              type
              typeSecond
              url
              urlSecond
              width
              height
              iconUrl
              iconUrlSecond
              iconWidth
              iconHeight
              mediumUrl
              mediumUrlSecond
              mediumWidth
              mediumHeight
            }
            enclosuresAttachments {
              position
              type
              name
              extension
              url
              previewUrl
            }
            series {
              id
              name
              link
            }
            awardedParameters {
              id
              name
              values {
                id
                name
                link
                search {
                  icon
                  desktop
                  tablet
                  mobile
                }
                projector {
                  icon
                  desktop
                  tablet
                  mobile
                }
              }
              contextValue
              search {
                icon
                desktop
                tablet
                mobile
              }
              projector {
                icon
                desktop
                tablet
                mobile
              }
            }
            parametersWithContext {
              id
              name
              values {
                id
                name
                link
                search {
                  icon
                  desktop
                  tablet
                  mobile
                }
                projector {
                  icon
                  desktop
                  tablet
                  mobile
                }
              }
              contextValue
              search {
                icon
                desktop
                tablet
                mobile
              }
              projector {
                icon
                desktop
                tablet
                mobile
              }
            }
            sizes {
              id
              name
              code
              codeProducer
              codeExtern
              amount
              amount_mo
              amount_mw
              amount_mp
              weight
              availability {
                visible
                description
                status
                icon
                deliveryDate
              }
              shipping {
                today
              }
              price {
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
                omnibusPrice {
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
                  worth {
                    value
                    currency
                    formatted
                  }
                  vatPercent
                  vatString
                }
                beforeRebate {
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
                crossedPrice {
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
                youSave {
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
                unit {
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
                max {
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
                suggested {
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
                unitConvertedPrice {
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
                rebateNumber {
                  number
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
                  allThresholds {
                    percent
                    firstThresholdValue
                    endThresholdValue
                    points {
                      value
                      formatted
                    }
                    thresholdDiff
                    minQuantity
                    priceAfterRebate {
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
                    products {
                      id
                    }
                  }
                }
                lastPriceChangeDate
                advancePrice {
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
                promotionDuration {
                  promotionTill {
                    date {
                      day
                      month
                      year
                      weekDay
                      formatted
                    }
                    time {
                      hour
                      minutes
                      seconds
                    }
                    timestamp
                  }
                  discountTill {
                    date {
                      day
                      month
                      year
                      weekDay
                      formatted
                    }
                    time {
                      hour
                      minutes
                      seconds
                    }
                    timestamp
                  }
                  distinguishedTill {
                    date {
                      day
                      month
                      year
                      weekDay
                      formatted
                    }
                    time {
                      hour
                      minutes
                      seconds
                    }
                    timestamp
                  }
                  specialTill {
                    date {
                      day
                      month
                      year
                      weekDay
                      formatted
                    }
                    time {
                      hour
                      minutes
                      seconds
                    }
                    timestamp
                  }
                }
              }
              amountWholesale
            }
            points
            pointsReceive
            subscription {
              periods
              rebate {
                type
                value
                valueFormatted
                numberOfRenewalsFrom
                numberOfRenewalsTo
              }
              minimumQuantity
            }
          }
        }
      }`)
}

export function getProducts4lopQuery({page = 0, limit = 6, orderBy = { name: "bestFit", type: "desc" }, text = "", maxPrice = 5000}: {page: number, limit: number, orderBy: { name: string, type: string }, text: string, maxPrice: number}) {
    return(`
{
              
    products(filterInput: {
        text: "${text}",
        priceRanges: {
            from: 0,
            to: ${maxPrice}
        },
        producers: [1594813770]
      }, settingsInput: {
        page: ${page},
        limit: ${limit},
        orderBy: { name: ${orderBy.name}, type: ${orderBy.type} }
      }) {
        results {
          resultCount
          resultPage
          currentPage
          limitPerPage
        }
        orderBy {
          name
          type
        }
        filtrContext {
          name
          value
        }
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
          price {
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
            omnibusPrice {
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
              worth {
                value
                currency
                formatted
              }
              vatPercent
              vatString
            }
            beforeRebate {
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
            crossedPrice {
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
            youSave {
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
            unit {
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
            max {
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
            suggested {
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
            unitConvertedPrice {
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
            rebateNumber {
              number
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
              allThresholds {
                percent
                firstThresholdValue
                endThresholdValue
                points {
                  value
                  formatted
                }
                thresholdDiff
                minQuantity
                priceAfterRebate {
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
              }
            }
            lastPriceChangeDate
            advancePrice {
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
            promotionDuration {
              promotionTill {
                date {
                  day
                  month
                  year
                  weekDay
                  formatted
                }
                time {
                  hour
                  minutes
                  seconds
                }
                timestamp
              }
              discountTill {
                date {
                  day
                  month
                  year
                  weekDay
                  formatted
                }
                time {
                  hour
                  minutes
                  seconds
                }
                timestamp
              }
              distinguishedTill {
                date {
                  day
                  month
                  year
                  weekDay
                  formatted
                }
                time {
                  hour
                  minutes
                  seconds
                }
                timestamp
              }
              specialTill {
                date {
                  day
                  month
                  year
                  weekDay
                  formatted
                }
                time {
                  hour
                  minutes
                  seconds
                }
                timestamp
              }
            }
          }
          unit {
            id
            name
            singular
            plural
            fraction
            sellBy
            precision
          }
          producer {
            id
            name
            link
          }
          category {
            id
            name
            link
          }
          group {
            id
            name
            displayAll
            link
            versions {
              id
              name
              icon
              iconSecond
              iconSmall
              iconSmallSecond
              productIcon
              productIconSecond
              productIconSmall
              productIconSmallSecond
              link
              parameterValues {
                id
                name
                link
                search {
                  icon
                  desktop
                  tablet
                  mobile
                }
                projector {
                  icon
                  desktop
                  tablet
                  mobile
                }
              }
            }
            groupParameters {
              id
              name
              values {
                id
                name
                link
                search {
                  icon
                  desktop
                  tablet
                  mobile
                }
                projector {
                  icon
                  desktop
                  tablet
                  mobile
                }
              }
              contextValue
              search {
                icon
                desktop
                tablet
                mobile
              }
              projector {
                icon
                desktop
                tablet
                mobile
              }
            }
          }
          opinion {
            rating
            count
            link
          }
          enclosuresImages {
            position
            type
            typeSecond
            url
            urlSecond
            width
            height
            iconUrl
            iconUrlSecond
            iconWidth
            iconHeight
            mediumUrl
            mediumUrlSecond
            mediumWidth
            mediumHeight
          }
          enclosuresAttachments {
            position
            type
            name
            extension
            url
            previewUrl
          }
          series {
            id
            name
            link
          }
          awardedParameters {
            id
            name
            values {
              id
              name
              link
              search {
                icon
                desktop
                tablet
                mobile
              }
              projector {
                icon
                desktop
                tablet
                mobile
              }
            }
            contextValue
            search {
              icon
              desktop
              tablet
              mobile
            }
            projector {
              icon
              desktop
              tablet
              mobile
            }
          }
          parametersWithContext {
            id
            name
            values {
              id
              name
              link
              search {
                icon
                desktop
                tablet
                mobile
              }
              projector {
                icon
                desktop
                tablet
                mobile
              }
            }
            contextValue
            search {
              icon
              desktop
              tablet
              mobile
            }
            projector {
              icon
              desktop
              tablet
              mobile
            }
          }
          sizes {
            id
            name
            code
            codeProducer
            codeExtern
            amount
            amount_mo
            amount_mw
            amount_mp
            weight
            availability {
              visible
              description
              status
              icon
              deliveryDate
            }
            shipping {
              today
            }
            price {
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
              omnibusPrice {
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
                worth {
                  value
                  currency
                  formatted
                }
                vatPercent
                vatString
              }
              beforeRebate {
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
              crossedPrice {
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
              youSave {
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
              unit {
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
              max {
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
              suggested {
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
              unitConvertedPrice {
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
              rebateNumber {
                number
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
                allThresholds {
                  percent
                  firstThresholdValue
                  endThresholdValue
                  points {
                    value
                    formatted
                  }
                  thresholdDiff
                  minQuantity
                  priceAfterRebate {
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
                }
              }
              lastPriceChangeDate
              advancePrice {
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
              promotionDuration {
                promotionTill {
                  date {
                    day
                    month
                    year
                    weekDay
                    formatted
                  }
                  time {
                    hour
                    minutes
                    seconds
                  }
                  timestamp
                }
                discountTill {
                  date {
                    day
                    month
                    year
                    weekDay
                    formatted
                  }
                  time {
                    hour
                    minutes
                    seconds
                  }
                  timestamp
                }
                distinguishedTill {
                  date {
                    day
                    month
                    year
                    weekDay
                    formatted
                  }
                  time {
                    hour
                    minutes
                    seconds
                  }
                  timestamp
                }
                specialTill {
                  date {
                    day
                    month
                    year
                    weekDay
                    formatted
                  }
                  time {
                    hour
                    minutes
                    seconds
                  }
                  timestamp
                }
              }
            }
            amountWholesale
          }
          points
          pointsReceive
          subscription {
            periods
            rebate {
              type
              value
              valueFormatted
              numberOfRenewalsFrom
              numberOfRenewalsTo
            }
            minimumQuantity
          }
        }
        filters {
          id
          value
          type
          name
          displayType
          groups {
            id
            name
          }
          items {
            value
            name
            productsCount
            ikon
            groupId
            other
          }
        }
        redirect {
          path
        }
        took
      }
    }
`)
}

export const options: Table[] = [
    { 
        name: "Stół podstawowy", 
        letter: "A", 
        path: "stol_podst", 
        thumb: Image1,
        addons: [
            {
                name: "Półka boczna 80x20cm",
                price: 143, 
                code: "65fc63a5df6f5dc50ecd1ddd", 
                size: "uniw"
            },
            {
                name: "Półka boczna 80x40cm",
                price: 197, 
                code: "65fc6384df6f5dc50ecd1ddc", 
                size: "uniw"
            },
            {
                name: "Półka z uchwytem na laptop",
                price: 319, 
                code: "65fc6f4666020a462cfefb6f", 
                size: "uniw"
            },
            {
                name: "Zestaw kosza na śmieci",
                price: 149, 
                code: "65fc6f7f66020a462cfefb70", 
                size: "uniw"
            },
            {
                name: "Półka 160x20cm pod blat/na nadstawkę",
                price: 0, 
                code: "0", 
                size: "uniw",
                notAvailable: true,
                hidden: true
            },
            {
                name: "Nadstawka do stołu",
                versions: [
                    { len: 140, price: 253, code: "65fc6fe266020a462cfefb71", size: "uniw" },
                    { len: 160, price: 281, code: "65fc700566020a462cfefb72", size: "uniw" },
                    { len: 180, price: 319, code: "65fc702e66020a462cfefb73", size: "uniw" },
                    { len: 200, price: 337, code: "65fc704e66020a462cfefb74", size: "uniw" }
                ]
            },
            {
                name: "Półka górna na kartony",
                depedencies: [6],
                versions: [
                    { len: 140, price: 243, code: "65fc740c66020a462cfefb75", size: "uniw" },
                    { len: 160, price: 272, code: "65fc742866020a462cfefb76", size: "uniw" },
                    { len: 180, price: 300, code: "65fc743766020a462cfefb77", size: "uniw" },
                    { len: 200, price: 319, code: "65fc744566020a462cfefb78", size: "uniw" }
                ]
            },
            {
                name: "Półka pod blat/na nadstawkę",
                depedencies: [6],
                versions: [
                    { len: 140, price: 152, code: "65fc753666020a462cfefb79", size: "uniw" },
                    { len: 160, price: 188, code: "65fc759666020a462cfefb7c", size: "uniw" },
                    { len: 180, price: 206, code: "65fc755266020a462cfefb7a", size: "uniw" },
                    { len: 200, price: 233, code: "65fc755f66020a462cfefb7b", size: "uniw" }
                ]
            },
            {
                name: "Rurka na stretch z uchwytami",
                depedencies: [6],
                versions: [
                    { len: 140, price: 93, code: "65fc75f966020a462cfefb7d", size: "uniw" },
                    { len: 160, price: 112, code: "65fc761166020a462cfefb7e", size: "uniw" },
                    { len: 180, price: 131, code: "65fc762c66020a462cfefb7f", size: "uniw" },
                    { len: 200, price: 140, code: "65fc763766020a462cfefb80", size: "uniw" }
                ]
            },
            {
                name: "Uchwyt do monitoringu",
                price: 305, 
                code: "65fc76aa66020a462cfefb81", 
                size: "uniw",
                depedencies: [6],
            },
            {
                name: "Uchwyt kamery",
                price: 98, 
                code: "65fc634bdf6f5dc50ecd1ddb", 
                size: "uniw",
                depedencies: [6, 7],
            }
        ]
    }
    // { 
    //     name: "Stół warsztatowy", 
    //     letter: "B", 
    //     path: "stol_warsztat", 
    //     thumb: Image2,
    //     addons: [
    //         {
    //             name: "Plecki z siatką na akcesoria",
    //             price: 0, 
    //             code: 0, 
    //             size: "uniw"
    //         },
    //         {
    //             name: "Wózek na narzędzia",
    //             price: 0, 
    //             code: 0, 
    //             size: "uniw"
    //         },
    //         {
    //             name: "Półka górna",
    //             price: 0, 
    //             code: 0, 
    //             size: "uniw"
    //         }
    //     ]
    // },
    // { 
    //     name: "Stół z nożem bocznym", 
    //     letter: "C", 
    //     path: "stol_nozem", 
    //     thumb: Image3,
    //     addons: [
    //         // { 
    //         //     name: "Półka boczna 80x20cm", versions: {
    //         //         140: { price: 149, code: 11311, size: "uniw" },
    //         //         160: { price: 149, code: 11311, size: "uniw" },
    //         //         180: { price: 149, code: 11311, size: "uniw" },
    //         //         200: { price: 149, code: 11311, size: "uniw" },
    //         //     }
    //         // },
    //         // { 
    //         //     name: "Półka boczna 80x40cm", versions: {
    //         //         140: { price: 206, code: 11431, size: "uniw" },
    //         //         160: { price: 206, code: 11431, size: "uniw" },
    //         //         180: { price: 206, code: 11431, size: "uniw" },
    //         //         200: { price: 206, code: 11431, size: "uniw" },
    //         //     }
    //         // },
    //         // { 
    //         //     name: "Półka z uchwytem na laptop", versions: {
    //         //         140: { price: 319, code: 11432, size: "uniw" },
    //         //         160: { price: 319, code: 11432, size: "uniw" },
    //         //         180: { price: 319, code: 11432, size: "uniw" },
    //         //         200: { price: 319, code: 11432, size: "uniw" },
    //         //     }
    //         // },
    //         // { 
    //         //     name: "Zestaw kosza na śmieci", versions: {
    //         //         140: { price: 149, code: 11306, size: "uniw" },
    //         //         160: { price: 149, code: 11306, size: "uniw" },
    //         //         180: { price: 149, code: 11306, size: "uniw" },
    //         //         200: { price: 149, code: 11306, size: "uniw" },
    //         //     }
    //         // },
    //         // { 
    //         //     name: "Półka 160x20cm pod blat/na nadstawkę", versions: {
    //         //         140: { price: 0, code: 0, size: "" },
    //         //         160: { price: 0, code: 0, size: "" },
    //         //         180: { price: 0, code: 0, size: "" },
    //         //         200: { price: 0, code: 0, size: "" }
    //         //     }
    //         // },
    //         // { 
    //         //     name: "Nadstawka zestaw krótki", versions: {
    //         //         140: { price: 0, code: 0, size: "" },
    //         //         160: { price: 0, code: 0, size: "" },
    //         //         180: { price: 0, code: 0, size: "" },
    //         //         200: { price: 0, code: 0, size: "" }
    //         //     }
    //         // },
    //         // { 
    //         //     name: "Półka górna z siatką z seperatorami krótka", versions: {
    //         //         140: { price: 0, code: 0, size: "" },
    //         //         160: { price: 0, code: 0, size: "" },
    //         //         180: { price: 0, code: 0, size: "" },
    //         //         200: { price: 0, code: 0, size: "" }
    //         //     }
    //         // },
    //         // { 
    //         //     name: "Półka 160x20cm pod blat/na nadstawkę", versions: {
    //         //         140: { price: 0, code: 0, size: "" },
    //         //         160: { price: 0, code: 0, size: "" },
    //         //         180: { price: 0, code: 0, size: "" },
    //         //         200: { price: 0, code: 0, size: "" }
    //         //     }
    //         // },
    //         // { 
    //         //     name: "Rurka na stretch z uchwytami krótki", versions: {
    //         //         140: { price: 0, code: 0, size: "" },
    //         //         160: { price: 0, code: 0, size: "" },
    //         //         180: { price: 0, code: 0, size: "" },
    //         //         200: { price: 0, code: 0, size: "" }
    //         //     }
    //         // },
    //         // { 
    //         //     name: "Zestaw do monitoringu", versions: {
    //         //         140: { price: 0, code: 0, size: "" },
    //         //         160: { price: 0, code: 0, size: "" },
    //         //         180: { price: 0, code: 0, size: "" },
    //         //         200: { price: 0, code: 0, size: "" }
    //         //     }
    //         // },
    //         // { 
    //         //     name: " Uchwyt do monitoringu", versions: {
    //         //         140: { price: 0, code: 0, size: "" },
    //         //         160: { price: 0, code: 0, size: "" },
    //         //         180: { price: 0, code: 0, size: "" },
    //         //         200: { price: 0, code: 0, size: "" }
    //         //     }
    //         // }
    //     ]
    // }
]









// export const options: ConfigOptions = [
//     { 
//         name: "Stół podstawowy", 
//         letter: "A", 
//         path: "stol_podst", 
//         thumb: Image1,
//         addons: [
//             { 
//                 name: "Półka boczna 80x20cm", versions: {
//                     140: { price: 149, code: 11311, size: "uniw" },
//                     160: { price: 149, code: 11311, size: "uniw" },
//                     180: { price: 149, code: 11311, size: "uniw" },
//                     200: { price: 149, code: 11311, size: "uniw" },
//                 }
//             },
//             { 
//                 name: "Półka boczna 80x40cm", versions: {
//                     140: { price: 206, code: 11431, size: "uniw" },
//                     160: { price: 206, code: 11431, size: "uniw" },
//                     180: { price: 206, code: 11431, size: "uniw" },
//                     200: { price: 206, code: 11431, size: "uniw" },
//                 }
//             },
//             { 
//                 name: "Półka z uchwytem na laptop", versions: {
//                     140: { price: 319, code: 11432, size: "uniw" },
//                     160: { price: 319, code: 11432, size: "uniw" },
//                     180: { price: 319, code: 11432, size: "uniw" },
//                     200: { price: 319, code: 11432, size: "uniw" },
//                 }
//             },
//             { 
//                 name: "Zestaw kosza na śmieci", versions: {
//                     140: { price: 149, code: 11306, size: "uniw" },
//                     160: { price: 149, code: 11306, size: "uniw" },
//                     180: { price: 149, code: 11306, size: "uniw" },
//                     200: { price: 149, code: 11306, size: "uniw" },
//                 }
//             },
//             { 
//                 name: "Półka 160x20cm pod blat/na nadstawkę", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             { 
//                 name: "Nadstawka do stołu", versions: {
//                     140: { price: 253, code: 13973, size: "uniw" },
//                     160: { price: 281, code: 11857, size: "uniw" },
//                     180: { price: 319, code: 11858, size: "uniw" },
//                     200: { price: 337, code: 11859, size: "uniw" }
//                 }
//             },
//             { 
//                 name: "Półka górna na kartony", versions: {
//                     140: { price: 243, code: 12853, size: "uniw" },
//                     160: { price: 272, code: 11376, size: "uniw" },
//                     180: { price: 300, code: 11424, size: "uniw" },
//                     200: { price: 319, code: 11425, size: "uniw" }
//                 }
//             },
//             { 
//                 name: "Półka 160x20cm pod blat/na nadstawkę", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             {
//                 name: "Rurka na stretch z uchwytami", versions: {
//                     140: { price: 93, code: 12851, size: "uniw" },
//                     160: { price: 112, code: 11304, size: "uniw" },
//                     180: { price: 131, code: 11426, size: "uniw" },
//                     200: { price: 140, code: 11305, size: "uniw" }
//                 }
//             },
//             { 
//                 name: "Uchwyt kamery", versions: {
//                     140: { price: 102, code: 11427, size: "uniw" },
//                     160: { price: 102, code: 11427, size: "uniw" },
//                     180: { price: 102, code: 11427, size: "uniw" },
//                     200: { price: 102, code: 11427, size: "uniw" },
//                 }  
//             },
//             { 
//                 name: "Uchwyt do monitoringu", versions: {
//                     140: { price: 319, code: 11433, size: "uniw" },
//                     160: { price: 319, code: 11433, size: "uniw" },
//                     180: { price: 319, code: 11433, size: "uniw" },
//                     200: { price: 319, code: 11433, size: "uniw" },
//                 } 
//             }
//         ]
//     },
//     { 
//         name: "Stół warsztatowy", 
//         letter: "B", 
//         path: "stol_warsztat", 
//         thumb: Image2,
//         addons: [
//             { 
//                 name: "Plecki z siatką na akcesoria", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             { 
//                 name: "Wózek na narzędzia", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             { 
//                 name: "Półka górna", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//         ]
//     },
//     { 
//         name: "Stół z nożem bocznym", 
//         letter: "C", 
//         path: "stol_nozem", 
//         thumb: Image3,
//         addons: [
//             { 
//                 name: "Półka boczna 80x20cm", versions: {
//                     140: { price: 149, code: 11311, size: "uniw" },
//                     160: { price: 149, code: 11311, size: "uniw" },
//                     180: { price: 149, code: 11311, size: "uniw" },
//                     200: { price: 149, code: 11311, size: "uniw" },
//                 }
//             },
//             { 
//                 name: "Półka boczna 80x40cm", versions: {
//                     140: { price: 206, code: 11431, size: "uniw" },
//                     160: { price: 206, code: 11431, size: "uniw" },
//                     180: { price: 206, code: 11431, size: "uniw" },
//                     200: { price: 206, code: 11431, size: "uniw" },
//                 }
//             },
//             { 
//                 name: "Półka z uchwytem na laptop", versions: {
//                     140: { price: 319, code: 11432, size: "uniw" },
//                     160: { price: 319, code: 11432, size: "uniw" },
//                     180: { price: 319, code: 11432, size: "uniw" },
//                     200: { price: 319, code: 11432, size: "uniw" },
//                 }
//             },
//             { 
//                 name: "Zestaw kosza na śmieci", versions: {
//                     140: { price: 149, code: 11306, size: "uniw" },
//                     160: { price: 149, code: 11306, size: "uniw" },
//                     180: { price: 149, code: 11306, size: "uniw" },
//                     200: { price: 149, code: 11306, size: "uniw" },
//                 }
//             },
//             { 
//                 name: "Półka 160x20cm pod blat/na nadstawkę", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             { 
//                 name: "Nadstawka zestaw krótki", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             { 
//                 name: "Półka górna z siatką z seperatorami krótka", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             { 
//                 name: "Półka 160x20cm pod blat/na nadstawkę", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             { 
//                 name: "Rurka na stretch z uchwytami krótki", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             { 
//                 name: "Zestaw do monitoringu", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             },
//             { 
//                 name: " Uchwyt do monitoringu", versions: {
//                     140: { price: 0, code: 0, size: "" },
//                     160: { price: 0, code: 0, size: "" },
//                     180: { price: 0, code: 0, size: "" },
//                     200: { price: 0, code: 0, size: "" }
//                 }
//             }
//         ]
//     }
// ]