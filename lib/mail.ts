import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmationLink = `${process.env.NEXTAUTH_URL}/auth/new-verification?token=${token}`
    const emailBody = `<p>Please click the following link to verify your email address: <a href="${confirmationLink}">link</a></p>`

    await resend.emails.send({
        from: "noreply@kamilmarczak.pl",
        to: email,
        subject: "Email verification",
        html: emailBody
    })
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmationLink = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${token}`
    const emailBody = `<p>Please click the following link to reset your password: <a href="${confirmationLink}">link</a></p>`

    await resend.emails.send({
        from: "noreply@kamilmarczak.pl",
        to: email,
        subject: "Password reset",
        html: emailBody
    })
}