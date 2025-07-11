import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    reviewedBy: {
        type: String,
        default: null,
    },
    userName: {
        type: String,
        required: true,
        index: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        min: [8, "Min Password should be 8"],
        max: 12,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    regionAssigned: {
        type: String,
        required: true,
    },
    // location:{
    //     type: { type: String, default:"Point"},
    //     coordinates: [Number],
    // },
    role: {
        type: String,
        default: "Admin",
    },
});

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    if (!this.adminId) {
        this.adminId = await generateAdminId();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.isCorrectPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            adminId: this.adminId,
            regionAssigned: this.regionAssigned,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};
adminSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            adminId: this.adminId,
            regionAssigned: this.regionAssigned,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const Admin = mongoose.model("Admin", adminSchema);
