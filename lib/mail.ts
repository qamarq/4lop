import { Resend } from 'resend';
import nodemailer from "nodemailer";
import { render } from '@react-email/render';
import { WelcomeEmail } from '@/components/emails/welcome';
import { prisma } from './db';

const resend = new Resend(process.env.RESEND_API_KEY);

export const transporter = nodemailer.createTransport({
    host: "serwer1720679.home.pl",
    port: 465,
    secure: true, // upgrade later with STARTTLS
    auth: {
        user: "noreply@4lop.pl",
        pass: "jXF7SOpd",
    },
}); 

export const sendVerificationEmail = async (email: string, token: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { error: "User not found" }
    const confirmationLink = `${process.env.NEXTAUTH_URL}/auth/new-verification?token=${token}`
    const emailHtml = render(WelcomeEmail({ username: user.name || "", url: confirmationLink }));

    const mailOptions = {
        from: '4lop <noreply@4lop.pl>',
        to: email,
        subject: "Email verification - 4lop",
        html: emailHtml
    };
      
    transporter.sendMail(mailOptions);
}

export const sendPasswordResetEmail = async (email: string, token: string) => {
    const confirmationLink = `${process.env.NEXTAUTH_URL}/auth/new-password?token=${token}`
    const emailBody = `<p>Please click the following link to reset your password: <a href="${confirmationLink}">link</a></p>`

    // await resend.emails.send({
    //     from: "noreply@kamilmarczak.pl",
    //     to: email,
    //     subject: "Password reset",
    //     html: emailBody
    // })

    const mailOptions = {
        from: '4lop <noreply@4lop.pl>',
        to: email,
        subject: "Password reset - 4lop",
        html: emailBody
    };
      
    transporter.sendMail(mailOptions);
}

/**
 * Wysyła email z podanym tematem i treścią do podanego adresu email
 * @param email Parametr email odbiorcy
 * @param subject Parametr tematu wiadomości
 * @param body Parametr treści wiadomości
 */
export const sendEmail = async (email: string, subject: string, body: string) => {
    const mailOptions = {
        from: '4lop <noreply@4lop.pl>',
        to: email,
        subject: subject,
        html: body
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("Error sending email: ", error)
            return { error: true, message: error }
        } else {
            console.log("Email sent: ", info.response)
            return { success: true, message: info.response }
        }   
    });
}