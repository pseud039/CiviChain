import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phone:{
        type:Number,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    department:{
        type:String,
        required:true,
    },
    regionAssigned:{
        type:String,
        required:true,
    },
},{timestamps:true});

UserSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10);
    next() 
});

UserSchema.methods.isCorrectPassword = async function(password){
    return await bcrypt.compare(password,this.password);
}

export const Admin = mongoose.model("Admin",AdminSchema);