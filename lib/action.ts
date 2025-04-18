'use server';

import { MAIL_PASSWORD, MAIL_USERNAME } from '@/lib/utils';
import { redirect } from 'next/navigation';
// import nodemailer from 'nodemailer';

export async function sendMail(form: FormData) {

  try {
    const {
      name,
      surname,
      email,
      phone,
      message
    } = Object.fromEntries(form.entries()) as {
      name: string;
      surname: string;
      email: string;
      phone: string;
      message: string;
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: MAIL_USERNAME,
      to: MAIL_USERNAME,
      subject: "Interesado en casa laureles",
      html: `
        <h1>Hola soy ${name} ${surname}</h1>
        <p>Mi correo es ${email}</p>
        <p>Mi telefono es ${phone}</p>
        <p>${message}</p>
        <p>Gracias por su atención</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    redirect('/?messageState=Mensaje enviado con exito')
  }
}