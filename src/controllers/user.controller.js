import { asyncHandler } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
import { Official } from "../models/official.model.js";

const generateAccessAndRefreshTokens = async (UserId, Model) => {
    try {
        if (!Model) throw new ApiError(400, "Invalid role provided");

        const user = await Model.findById(UserId);
        if (!user) {
            throw new ApiError(400, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(400, "Something went wrong");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    //get user detail from frontend
    const { name, userName, email, phone, password } = req.body;

    //validate - not empty
    if (
        [name, userName, email, phone, password].some(
            (field) => !field || !field?.trim() === ""
        )
    ) {
        throw new ApiError(400, `All fields are required`);
    }

    // check if user already exits:email
    const existingUser = await User.findOne({
        $or: [{ email }, { userName }],
    });

    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    //if there are images to upload: then check for imge,upload to cloudinary,create user object
    // create entry in db
    const user = await User.create({
        name,
        userName: userName.toLowerCase(),
        email,
        phone,
        password,
    });
    // console.log("REQ BODY", req.body);

    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!userCreated) {
        throw new ApiError(
            500,
            "Something went wrong while registering the user"
        );
    }

    //remove password and refresh token from response
    //check for user creation: null to nahi hua h

    //return res
    return res
        .status(201)
        .json(
            new ApiResponse(200, userCreated, "User Registered Successfully")
        );
});

function checkModel(userName) {
    try {
        if (userName.startsWith("ADM")) {
            return Admin;
        } else if (userName.startsWith("OFF")) {
            return Official;
        } else if (userName.includes("@")) {
            return User;
        } else {
            return User;
        }
    } catch (error) {
        throw new ApiError(400, "Something went wrong");
    }
}

const loginUser = asyncHandler(async (req, res) => {
    const { userName, password } = req.body;

    if ([userName, password].some((field) => !field || !field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    const Model = checkModel(userName);
    if (!Model) {
        throw new ApiError(400, "Invalid userName");
    }
    const query = userName.includes("@") ? { email: userName } : { userName };
    const user = await Model.findOne(query); 
    
    if (!user) {
        throw new ApiError(404, `Model not found`);
    }
    const isPasswordValid = await user.isCorrectPassword(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid user credential");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        user._id,
        Model
    );
    const loggedInUser = user.toObject();
    delete loggedInUser.password;
    delete loggedInUser.refreshToken;

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in Successfully"
            )
        );
});

const logoutUser = async (req, res) => {
    console.log(req.user);
    const { userName } = req.user;
    const Model = checkModel(userName);
    if (!Model) throw new ApiError(400, "Invalid user role");

    await Model.findByIdAndUpdate(req.user._id, {
        $set: { refreshToken: undefined },
    });

    const options = {
        httpOnly: true,
        secure: true,
    };

    res.status(200)
        .clearCookie("accessToken", accessToken, options)
        .clearCookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {}, "User loggged out"));
};

export { registerUser, loginUser, logoutUser, generateAccessAndRefreshTokens };
