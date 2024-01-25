import { AccountType, UserRole } from '@prisma/client';
import * as z from 'zod';

export const SettingsSchema = z.object({
    firstname: z.optional(z.string()),
    lastname: z.optional(z.string()),
    email: z.optional(z.string().email()),
    street: z.optional(z.string()),
    city: z.optional(z.string()),
    zipCode: z.optional(z.string()),
    phone: z.optional(z.string()),
    country: z.optional(z.string()),

    password: z.optional(z.string().min(6).max(100)),
    newPassword: z.optional(z.string().min(6).max(100)),
})

export const ChangePassSchema = z.object({
    password: z.string().min(8).max(100),
    newPassword: z.string().min(8).max(100),
})
    .refine((data) => {
        if (!data.newPassword && data.password) {
            return false;
        }

        return true;
    }, {
        message: "New password is required when changing password",
        path: [ "newPassword" ],
    })
    .refine((data) => {
        if (!data.password && data.newPassword) {
            return false;
        }

        return true;
    }, {
        message: "Password is required when changing password",
        path: [ "password" ],
    })

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email',
    }),
    password: z.string().min(8, {
        message: 'Password must be at least 8 characters',
    }).max(100),
    code: z.optional(z.string().length(6))
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email',
    }),
    password: z.string().min(8, {
        message: 'Password must be at least 8 characters',
    }).max(100),
    firstname: z.string().min(1, {
        message: 'Imię jest wymagane',
    }),
    lastname: z.string().min(1, {
        message: 'Nazwisko jest wymagane',
    }),
    street: z.string().min(1, {
        message: 'Ulica jest wymagana',
    }),
    city: z.string().min(1, {
        message: 'Miasto jest wymagane',
    }),
    zip: z.string().min(1, {
        message: 'Kod pocztowy jest wymagany',
    }),
    phone: z.string().min(1, {
        message: 'Numer telefonu jest wymagany',
    }),
    accountType: z.enum([ AccountType.WOMEN, AccountType.MAN, AccountType.OTHER, AccountType.BUSINESS ]),
    rulesAccepted: z.boolean(),
    newsLetter: z.boolean(),
})
    .refine((data) => {
        if (!data.rulesAccepted) {
            return false;
        }

        return true;
    }, {
        message: "Zaakceptuj regulamin",
        path: [ "rulesAccepted" ],
    })
    .refine((data) => {
        if (!data.accountType) {
            return false;
        }

        return true;
    }, {
        message: "Wybierz typ konta",
        path: [ "accountType" ],
    });

export const ResetSchema = z.object({
    email: z.string().email({
        message: 'Please enter a valid email',
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(8, {
        message: 'Password must be at least 8 characters',
    }).max(100),
});

export const BasicShipmentSchema = z.object({
    name: z.string().min(1, { message: "Nazwa jest wymagana" }),
    description: z.string().min(1, { message: "Opis jest wymagany" }),
    image: z.string().min(1, { message: "Obraz jest wymagany" }),
    price: z.string().min(1, { message: "Cena jest wymagana" }),
    pickupPoint: z.boolean(),
    personalCollection: z.boolean(),
    prepaid: z.boolean(),
    shippingTimeDays: z.string().min(1, { message: "Czas wysyłki jest wymagany" }),
    shippingInWeekends: z.boolean(),
    excluding: z.boolean(),
});