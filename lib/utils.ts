import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from "bcryptjs"
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

export const isPasswordCorrect = async (plainPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

export const prepareLink = (url: string) => {
    var parts = url.split('/');
    var lastPart = parts[parts.length - 1];
    var nameWithoutExtension = lastPart.replace('.html', '');
    return nameWithoutExtension
}

export const getCookieValue = (cookies: ReadonlyRequestCookies, name: string) => {
    const token = cookies.get(name);
    if (!token) {
        return false
    }
    const { value } = token;
    return value
}

export const formattedPrice = (price: number) => {
    return `${price.toFixed(2)} zł`
}