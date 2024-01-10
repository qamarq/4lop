import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from './db';

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    
    const exsitingToken = await getVerificationTokenByEmail(email)
    if (exsitingToken) {
        await prisma.verificationToken.delete({
            where: {
                id: exsitingToken.id
            }
        })
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return verificationToken
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4()
    const expires = new Date(new Date().getTime() + 3600 * 1000)
    
    const exsitingToken = await getPasswordResetTokenByEmail(email)
    if (exsitingToken) {
        await prisma.passwordResetToken.delete({
            where: {
                id: exsitingToken.id
            }
        })
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken
}