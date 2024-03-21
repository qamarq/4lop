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

export const createSlugLink = (name: string, id: string) => {
    const formattedName = slugify(name)
    return `/sklep/produkt/${formattedName}-${id}`
}

export const getCookieValue = (cookies: ReadonlyRequestCookies, name: string) => {
    const token = cookies.get(name);
    if (!token) {
        return false
    }
    const { value } = token;
    return value
}

export const getNetPrice = (price: number, tax: number) => {
    return price - (price * (tax / 100))
}

export const formattedPrice = (price: number) => {
    // return `${price.toFixed(2)} zł`
    const formatter = new Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
        minimumFractionDigits: 2,
    });

    // Zwróć sformatowaną cenę
    return formatter.format(price);
}

export const slugify = (str: string) => {
    return String(str)
        .normalize('NFKD') // split accented characters into their base characters and diacritical marks
        .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
        .trim() // trim leading or trailing whitespace
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
}

export const checkImage = (path: string) => {
    new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({path, status: 'ok'});
        img.onerror = () => resolve({path, status: 'error'});

        img.src = path;
    });
}