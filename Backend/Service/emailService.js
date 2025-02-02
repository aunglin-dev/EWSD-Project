import nodemailer from "nodemailer";

// Configure Nodemailer Transporter

export const emailAddress = "zakiayayacoob@gmail.com"
export const emailTransporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: emailAddress,
        pass: "qdmj hvyc okrn bphv",
    }
});


export default emailTransporter;