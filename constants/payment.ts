import { orderStatusType } from "@prisma/client";

export type PaymentStatus = "requires_confirmation" | "requires_action" | "processing" | "succeeded" | "requires_payment_method" | "canceled" | "incomplete";

export const paymentStatuses: Record<string, string> = {
    requires_confirmation: "Wymaga potwierdzenia",
    requires_action: "Wymaga akcji",
    processing: "Przetwarzanie",
    succeeded: "Płatność zakończona sukcesem",
    requires_payment_method: "Płatność zakończona niepowodzeniem",
    canceled: "Płatność anulowana",
    incomplete: "Płatność niekompletna",
    dvp: "Płatność przy odbiorze"
}

export type Przelewy24PaymentStatus = "0" | "1" | "2" | "3";

export const przelewy24PaymentStatuses: Record<string, string> = {
    "0": "Brak płatności",
    "1": "Zaliczka",
    "2": "Zapłacono",
    "3": "Anulowano",
}

export const orderStatuses: Record<orderStatusType, string> = {
    NEW: "Zamówienie złożone",
    PAID: "Zamówienie opłacone",
    PROCESSING: "Zamówienie w trakcie realizacji",
    SENDED: "Zamówienie wysłane",
    DELIVERED: "Zamówienie dostarczone",
    CANCELLED: "Zamówienie anulowane",
    REFUNDED: "Zamówienie zwrócone",
    RETURNED: "Zamówienie zwrócone",
    COMPLETED: "Zamówienie zakończone",
};

export const paymentOptions: Record<string, string> = {
    p24: "Przelewy24",
    blik: "BLIK",
    card: "Karta płatnicza",
    transfer: "Przelew bankowy",
    paypal: "PayPal",
    klarna: "Klarna",
}

export const paymentOptionsIcons: Record<string, string> = {
    p24: "https://avatars0.githubusercontent.com/u/17272690?s=400&v=4",
    blik: "https://www.aliorbank.pl/dam/jcr:5950c2d4-7908-47b8-bd57-0229b44b4901/blik.png",
    card: "https://elklatinfestival.pl/wp-content/uploads/2020/02/visa-mastercard.jpg",
    transfer: "transfer",
    paypal: "https://logos-world.net/wp-content/uploads/2020/07/PayPal-Logo.png",
    klarna: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Klarna_Payment_Badge.svg/1280px-Klarna_Payment_Badge.svg.png",
    dvp: "https://static.abstore.pl/design/accounts/a-d-e/img/ikonki/zapobraniem.png"
}