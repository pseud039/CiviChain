import { asyncHandler } from "../utils/errorHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Issue } from "../models/issue.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const Issues = asyncHandler(async(req,res,)=>{
    const {title, location, description,owner,progress,tags,address,votes} = req.body
    
    if([
        title,location,description,owner,progress,tags,address,votes
    ].some((field)=>field?.toString().trim()==="")){
        throw new ApiError(400,"All fields are required");
    }
    const ExistedIssue = await Issue.findOne({$and:[{location},{tags}]})

    if(ExistedIssue){
        throw new ApiError(409,"Issue already existed.")
    }

    const IssueLocalPath = req.files.IssueImg?.[0]?.path 

    if(!IssueLocalPath){
        throw new ApiError(400,"Issue Image is required");
    }
    const issueimg = await uploadOnCloudinary(IssueLocalPath)

    if(!issueimg||!issueimg.secure_url){
        throw new ApiError(409,"Cloudinary upload failed")
    }

    const issue = await Issue.create({
        title: title.toLowerCase(),
         location,
         description,
         owner,
         progress,
         tags,
         IssueImg: issueimg.secure_url,
         address,
         votes
    })
    const IssueCreated = await Issue.findById(issue._id);

    if(!IssueCreated){
        throw new ApiError(500,"Something went wrong while creating the issue ")
    }
    return res.status(201).json(
        new ApiResponse(200,IssueCreated,"Issue Registerd Successfully")
    )

})

export {Issues}
