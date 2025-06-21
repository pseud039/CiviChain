import {asyncHandler} from "../utils/errorHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async(req,res)=>{
//get user detail from frontend
const {name, username,email,phone,password}= req.body
// console.log("email: ",email);
//validate - not empty
if(
    [name,username,email,phone,password].some((field)=>field?.trim()==="")
){
    throw new ApiError(400,`All fields are required`)
}
// check if user already exits:email
const ExistedUser = User.findOne({
    $or:[{email},{username},{phone}]
})
if(ExistedUser){
    throw new ApiError(409, "User already exists");
}
//if there are images to upload: then check for imge,upload to cloudinary,create user object
// create entry in db
const user = await User.create({
    name, 
    username: username.toLowerCase(),
    email,
    phone,
    password,
})
const createdUser = await User.findById(user._id).select(
    "-password -RefreshToken"
)
if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering the user")
}
//remove password and refresh token from response
//check for user creation: null to nahi hua h
//return res
return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
)

})

export {registerUser}