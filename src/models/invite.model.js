import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const InviteSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, lowercase: true },
        email: { type: String, required: true },
        token: { type: String },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
            required: true,
        },
        isUsed:{
            type:Boolean,
            default:false,
            required:true,
        },
    },
    { timestamps: true }
);

InviteSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            isUsed: this.isUsed,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: process.env.TOKEN_EXPIRY }
    );
};

export const Invite = mongoose.model("Invite", InviteSchema);
