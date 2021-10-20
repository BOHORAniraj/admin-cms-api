import nodemailer from "nodemailer";

const send = async infoObj => {
	try {
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport({
			host: process.env.EMAIL_SMTP,
			port: 587,
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		});

		// send mail with defined transport object
		let info = await transporter.sendMail(infoObj);

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	} catch (error) {
		console.log(error);
	}
};

const emailProcessor = ({ email, subject, text, html }) => {
	let info = {
		from: `"EShop 🎈" <${process.env.EMAIL_USER}>`,
		to: email,
		subject,
		text,
		html,
	};

	send(info);
};

export const sendEmailVerificationLink = emailObj => {
	const { fname, pin, email } = emailObj;

	const link = `http://localhost:3000/email-verification?pin=${pin}&email=${email}`;
	const obj = {
		...emailObj,
		subject: "Email confirmation required",
		text: `Hi ${fname}, please follow the link below to confirm your email. ${link}`,
		html: `
    Hello there,   <br/> 
    Please follow the link below to confirm your email. <br/><br/>
   <a href="${link}" target="_blank"> ${link}  </a>
    <br/><br/>
    Thank you<br/><br/>  
    Kind Regards,
    --some company information --- 
    `,
	};
	emailProcessor(obj);
};

// send the email confirm welcome message
export const sendEmailVerificationConfirmation = emailObj => {
	const { fname } = emailObj;

	const obj = {
		...emailObj,
		subject: "Email verification successful",
		text: `Hi ${fname}, You email has been verified, You may login now!`,
		html: `
    Hello ${fname},
    <br/> 
    You email has been verified now.You may login <br/><br/> 
    <br/><br/>
    Thank you<br/><br/>  
    Kind Regards,<br/> 
    --some company information --- 
    `,
	};
	emailProcessor(obj);
};

// send the email notification for password update message
export const sendPasswordUpdateNotification = emailObj => {
	const { fname = "there" } = emailObj;

	const obj = {
		...emailObj,
		subject: "Your password has been update",
		text: `Hi ${fname}, Your password has just been update, if you did not make this change, please contact us immediately.`,
		html: `
    Hello ${fname},
    <br/> 
		Your password has just been update, if you did not make this change, please contact us immediately <br/><br/> 
    <br/><br/>
    Thank you<br/><br/>  
    Kind Regards,<br/> 
    --some company information --- 
    `,
	};
	emailProcessor(obj);
};

// send the email notification for password update message
export const sendPasswordResetOTP = emailObj => {
	const { fname, otp } = emailObj;

	const obj = {
		...emailObj,
		subject: "Rest password OTP",
		text: `Hi ${fname}, You the following OTP to reset your password. ${otp}. The otp will expire in 15 min`,
		html: `
    Hello ${fname},
    <br/> 
		You the following OTP to reset your password. 
		<br/><br/> 
		${otp}
		<br/><br/> 
		 The otp will expire in 15 min 
    <br/><br/>
    Thank you<br/><br/>  
    Kind Regards,<br/> 
    --some company information --- 
    `,
	};
	emailProcessor(obj);
};
