import nodemailer from "nodemailer";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { Invite } from "../models/invite.model.js";

const createInvite = asyncHandler(async (req, res) => {
    console.log(req.body);
    const { email, name } = req.body;
    if (!email) {
        throw new ApiError(400, "Invalid credentials");
    }
    const invite = new Invite({ name, email });
    await invite.save();
    const token = invite.generateToken();
    invite.token = token;
    await invite.save();
    const inviteLink = `${process.env.BASE_URL}/officials/register/${token}`;
    const inviteCreated = await Invite.findById(invite._id);

    if (!inviteCreated) {
        throw new ApiError(500, "Something went wrong");
    }
     const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.STMP_USER,
        to: email,
        subject: "Official Account Registration Invite",
        html: `
            <h2>You have been invited to register as an Official</h2>
            <p>Hello,</p>
             <p>You have been invited to register as an official in the Civichain department.</p>
            <p><a href="${inviteLink}" style="background: #2596be; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Complete Registration</a></p>
            <p>Or copy this link: ${inviteLink}</p>
            <p>This invite expires in 7 days.</p>
            <p>Best regards,<br>Admin Team</p>`,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return res
        .status(200)
        .json(new ApiResponse(200, info.messageId, "Invite Sent!"));
});

export { createInvite };
