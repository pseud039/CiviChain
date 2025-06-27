import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
    },
    username:{
        type:String,
        required:true,
        index:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:[true, 'Password is required'],
        min:[8,'Min Password should be 8'],
        max: 12,
    },
    RefreshToken:{
        type:String,
    },
    // location:{
    //     type: { type: String, default:"Point"},
    //     coordinates: [Number],
    // },
    role:{
        type:String,
        enum:["citizen","admin"], default:"citizen",
    }
},{timestamps:true});

UserSchema.index({location:"2dsphere"})

UserSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next()
});

UserSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

UserSchema.methods.generateAccessToken = function(){
    jwt.sign({
        _id: this._id,
        email:this.email,
        username:this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
)
}
UserSchema.methods.generateRefreshToken = function(){
      jwt.sign({
        _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { 
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
)
}

export const User = mongoose.model("User",UserSchema);
