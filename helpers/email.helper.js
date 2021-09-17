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
export const emailProcessor = ({  email ,subject , text , html  }) => {
    
    let info = {
        from: `"NIRAJ ESHOP 👻" <${process.env.EMAIL_USER}>`, // sender address
        to: email, 
        subject,
        text, 
        html, 
    

    }
    send(info);
}

export const sendEmailVerificationLink = (emailObj) => {
    
    const { fname, pin, email } = emailObj;
    const link = `http://localhost::3000/email-verification?pin=${pin}&email=${email}`
    
    const obj = {
        ...emailObj,
        subject: "Email conformation required",
        text: `Hi ${fname} please follow the link below to confirm your email.${link}`,
        html: `Hello there,
        <br/> please follow the link below to confirm your email <br/>
        <a href ="${link}"/><br/>
        thank you <br/>
        kind regards,
        `,
    }
    emailProcessor(obj)

}
export const sendEmailVerificationConfirmation = (emailObj) => {
    
    const { fname } = emailObj;
   
    
    const obj = {
        ...emailObj,
        subject: "Email verification Successful",
        text: `Hi ${fname} your email has been verified`,
        html: `Hello there,
        <br/>Thhank you your email has been verified<br/>
        kind regards,
        `,
    }
    emailProcessor(obj)

}