"use server"

import { currentRole } from "@/lib/auth";
import { prisma } from "@/lib/db"
import { UserRole } from "@prisma/client";
import { v4 } from "uuid";
import fs from 'fs';
import sharp from "sharp";
import sizeOf from "image-size";
import { revalidatePath } from "next/cache";

export const getUploadedFiles = async () => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { success: false, message: "Unauthorized" };
    
    const files = await prisma.media.findMany({})
    return { success: true, files }
}

export const getUploadedFileByURL = async (url: string) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { success: false, message: "Unauthorized" };
    
    const file = await prisma.media.findFirst({ where: { url } })
    return { success: true, file }

}

export const uploadFile = async (formData: FormData) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { success: false, message: "Unauthorized" };

    try {
        const file = formData.get('file') as File | undefined;
        const alt = formData.get('alt') as string;

        if (!file) return { success: false, message: "No file provided" }
        if (!alt) return { success: false, message: "No alt provided" }

        const newV4: string = v4();
        const newFileName = newV4+"."+file.name.split('.').pop();

        // Save file to server on folder /files/uploaded
        const saveFile = await file.arrayBuffer()
        const saveFileBuffer = Buffer.from(saveFile)

        // Convert to webp
        // const sharp = require('sharp');
        const webpFileBuffer = await sharp(saveFileBuffer).webp().toBuffer();
        const newWebpFileName = newV4+".webp";

        await Promise.all([
            new Promise((resolve, reject) => {
                fs.writeFile(`public/upload/${newFileName}`, saveFileBuffer, (e) => {
                    if (e) {
                        console.log('Error saving file', e);
                        reject(e);
                    } else {
                        console.log('File saved');
                        resolve("done");
                    }
                });
            }),
            new Promise((resolve, reject) => {
                fs.writeFile(`public/upload/${newWebpFileName}`, webpFileBuffer, (e) => {
                    if (e) {
                        console.log('Error saving webp file', e);
                        reject(e);
                    } else {
                        console.log('Webp file saved');
                        resolve("done");
                    }
                });
            })
        ]);

        const dimensions = sizeOf(`public/upload/${newFileName}`);
        // Save file to database
        await prisma.media.create({
            data: {
                alt: decodeURIComponent(alt),
                type: file.type,
                url: `/upload/${newFileName}`,
                urlSecond: `/upload/${newWebpFileName}`,
                width: dimensions.width || 0,
                height: dimensions.height || 0
            }
        });

        return { success: true, message: "Pomyślnie przesłano plik", url: `/upload/${newFileName}` }
    } catch (error) {
        console.log('Error uploading file', error);
        return { success: false, message: "Error uploading file" }
    }
}

export const deleteFile = async (id: string) => {
    const role = await currentRole()
    if (role !== UserRole.ADMIN) return { success: false, message: "Unauthorized" };

    const file = await prisma.media.findFirst({ where: { id } })
    if (!file) return { success: false, message: "Nie znaleziono pliku" }

    try {
        await prisma.media.delete({ where: { id } })
        fs.unlinkSync(`public${file.url}`);
        fs.unlinkSync(`public${file.urlSecond}`);

        revalidatePath('/dashboard/images')
        return { success: true, message: "Usunięto pliki" }
    } catch (error) {
        console.log('Error deleting file', error);
        return { success: false, message: "Podczas usuwania wystąpił błąd" }
    }
}

export const revalidateFiles = async () => {
    revalidatePath('/dashboard/images')
}