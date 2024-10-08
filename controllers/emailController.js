import nodemailer from 'nodemailer';
import { uploadFile } from '../middleware/uploadFileMiddleware';

const sendEmail = async (req, res, next) => {
    try {
        const upload = uploadFile.single('file');

        upload(req, res, function (err) {
            if (err) {
                const error = new Error("An unknown error occurred during file upload: " + err.message);
                return next(error);
            }

            const { firstname, lastname, address, phone, email, subject, explain, message, position } = req.body;
            const file = req.file;

            let transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false,
                auth: {
                    user: process.env.SMTP_MAIL,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            let mailOptions = {
                from: email,
                to: process.env.SMTP_MAIL,
                subject: subject,
                text: message,
                attachments: file ? [{ 
                    filename: file.originalname,
                    path: file.path
                }] : []
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        message: 'Failed to send email', 
                        error: error.toString()
                    });
                } else {
                    let replyMailOptions = {
                        from: process.env.SMTP_MAIL,
                        to: email,
                        subject: `You've applied for the ${position} position`,
                        text: `Dear khun ${firstname} ${lastname} Received Application`,
                        attachments: file ? [{
                            filename: file.originalname,
                            path: file.path
                        }] : []
                    };

                    transporter.sendMail(replyMailOptions, function(replyError, replyInfo){
                        if(replyError){
                            // console.log(replyError);
                            return res.status(500).json({
                                message: 'Failed to send reply email',
                                error: error.toString()
                            })
                        } 
                        else {
                            res.status(200).json({
                                message: 'Email sent successfully',
                                info: replyInfo
                            })
                        }
                    });
                }
            });
        });

    } catch (error) {
        next(error);
    }
};

export { sendEmail };