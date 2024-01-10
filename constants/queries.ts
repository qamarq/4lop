export const GET_BASKET_QUERY = (delivery: {courierId: string, prepaid: boolean} | null, addInsurance: boolean) => {
    var temp = ""
    if (delivery !== null) {
        temp = `courierId: "${delivery.courierId}", prepaid: ${delivery.prepaid}`
    }
    return `{
        basket(
            BasketCostInput: {
                delivery: {${temp}}
                addInsurance: ${addInsurance}
            }
        ) {
          basketCost {
            shippingUndefined
            basketShippingCost {
              shippingCost {
                value
                currency
                formatted
              }
              shippingCostPoints
              shippingCostAfterRebate {
                value
                currency
                formatted
              }
              shopVat {
                worth {
                  value
                  currency
                  formatted
                }
                vatPercent
                vatString
              }
            }
            orderMinimalWholesaleNotReached
            prepaidCost {
              value
              currency
              formatted
            }
            insuranceCost {
              value
              currency
              formatted
            }
            totalProductsCost {
              value
              currency
              formatted
            }
            totalProductsCostAtPoints {
              value
              formatted
            }
            totalAdditionalCost {
              value
              currency
              formatted
            }
            totalRebate {
              value
              currency
              formatted
            }
            totalRebateWithoutShipping {
              value
              currency
              formatted
            }
            totalToPay {
              value
              currency
              formatted
            }
            totalToPayAtPoints {
              value
              formatted
            }
            paymentAmountFromClientBalance {
              value
              currency
              formatted
            }
            totalYousave {
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
            paid {
              value
              currency
              formatted
            }
          }
          summaryBasket {
            productsCount
            orderDivisionPossible
            worth {
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
            worthPoints {
              value
              formatted
            }
            rebate {
              value
              currency
              formatted
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
            shipping {
              cost {
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
              shippingDays
            }
            shippingLater {
              cost {
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
              shippingDays
            }
          }
          products {
            id
            size
            comment
            availableNow
            additional
            quantity
            worth {
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
            worthPoints {
              value
              formatted
            }
            forPoints
            tax {
              worth {
                value
                currency
                formatted
              }
              vatPercent
              vatString
            }
            data {
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
            basketGroupId
            versionsName
            valuesVersionName
            bundleProducts {
              productId
              quantity
              name
              productType
              bundledId
              sizeId
              sizeName
              versionsName
              valuesVersionName
            }
          }
          basketGroups {
            id
            types
            worth {
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
            worthTotal {
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
            subscription {
              daysInPeriod
              rebate {
                type
                value
                valueFormatted
                numberOfRenewalsFrom
                numberOfRenewalsTo
              }
              nextOrder {
                day
                month
                year
                weekDay
                formatted
              }
            }
          }
          clientDetailsInBasket {
            id
            login
            firstname
            lastname
            participationPartnerProgram
            usesVat
            email
            isWholesaler
            isWholesalerOrder
            clientIdUpc
          }
        }
      }`
}