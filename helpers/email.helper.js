import nodemailer from 'nodemailer'



const send = async (infobj) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SMTP,
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })

        
        let info = await transporter.sendMail(infobj);
    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.log(error)
        
    }
    
}
export const emailProcessor = ({ fname, email, pin }) => {
    const link = `http://localhost::3000/email-verification?pin=${pin}&email=${email}`
    let info = {
        from: `"NIRAJ ESHOP 👻" <${process.env.EMAIL_USER}>`, // sender address
        to: email, // list of receivers
        subject: "Email conformation required", // Subject line
        text: `Hi please follow the link below to confirm your email.${link}`, // plain text body
        html: `Hello there,
        <br/> please follow the link below to confirm your email <br/>${link}<br/>
        thank you <br/>
        kind regards,
        `, // html body
    

    }
    send(info);
}