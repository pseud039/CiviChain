import {asyncHandler} from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js";


const generateAccessAndRefreshTokens = async(UserId) => {
    try {
        const user = await User.findById(UserId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken,refreshToken }; 

    } catch (error) {
        throw new ApiError(400,"Something went wrong");
    }
}

const registerUser = asyncHandler( async (req,res) => {

//get user detail from frontend
const {name,
    username,
    email,
    phone,
    password}= req.body;

//validate - not empty
if(
    [name,
    username,
    email,
    phone,
    password].some((field)=> !field?.trim()==="")
){
    throw new ApiError(400,`All fields are required`);
}

// check if user already exits:email
const ExistingUser = await User.findOne({
    $or:[{email},{username},{phone}]
});

if(ExistingUser){
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
// console.log("REQ BODY", req.body);

const Usercreated = await User.findById(user._id).select(
    "-password -RefreshToken");

if(!Usercreated){
    throw new ApiError(500,"Something went wrong while registering the user");
}

//remove password and refresh token from response
//check for user creation: null to nahi hua h

//return res
return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
)

});

const loginUser = asyncHandler( async(req,res) => {
     // check for the fields(not empty)
     const {email,
        username,
        password
     } = req.body;
     
     if(!username || !email){
         throw new ApiError(400, "Username or email is required");
        };

     // username or email based login
     const user = await  User.findOne({$or:[{email,username}]});
     // find the user
     if(!user){
        throw new ApiError(404, "User not found");
     }

     // password check
    const isPasswordValid =  await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credential");
    }

     // check the token 
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = UserSchema.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

     //  send cookies
     const options = {
        httpOnly: true,
        secure: true,
     };
     return res.status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",refreshToken,options)
     .json(
        new ApiResponse(
            200,
            {
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged in Successfully",
    ));
      
});

const logoutUser = async( req,res) => {
    await User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}});
    const options = {
        httpOnly:true,
        secure:true,
    };

    res.status(200)
    .clearCookie("accessToken",accessToken,options)
    .clearCookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{},"User loggged out"));

}
export { registerUser, loginUser, logoutUser };
