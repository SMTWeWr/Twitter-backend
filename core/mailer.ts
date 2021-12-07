import nodemailer from 'nodemailer';

const options = {
    service: 'Gmail',
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
    },
};

export const mailer = nodemailer.createTransport(options);
