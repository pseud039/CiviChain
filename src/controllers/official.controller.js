import { asyncHandler } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Official } from "../models/official.model.js";
import { Admin } from "../models/admin.model.js";

function generateOfficialId(token) {
    const Id = token.toString().substring(0, 5);
    const IdCreated = `OFF${Id}`;
    return IdCreated;
}

const registerOfficial = asyncHandler(async (req, res) => {
    console.log(req.inviteData);
    const { name, password, email, phone, regionAssigned } = req.body;
    const { inviteData } = req;
    if (
        [phone, name, email, regionAssigned, password].some(
            (field) => !field || field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "Invalid Credentials");
    }
    if (!email === inviteData.email || !name === inviteData.name) {
        throw new ApiError(400, "Email and name cannot be changed");
    }
    const official = await Official.create({
        name: inviteData.name,
        email: inviteData.email,
        userName: generateOfficialId(inviteData.token),
        regionAssigned,
        phone,
        password,
    });
    const officialCreated = await Official.findById(official._id).select(
        "-password -refreshToken"
    );
    if (!officialCreated) {
        throw new ApiError(500, "Something went wrong");
    }
    return res.status(201).json(new ApiResponse(200, officialCreated, "Official Registered"));
});
const reviewAdminRegistration = asyncHandler(async (req, res) => {
    const { adminId } = req.params;
    const { action, role } = req.body;

    if (role != "Official") {
        throw new ApiError(403, "Only officials can review this");
    }
    if (!["approve", "reject"].includes(action)) {
        throw new ApiError(400, "Action must be either 'approve' or 'reject'");
    }

    const admin = await Admin.findOne({ adminId });
    if (!admin) throw new ApiError(404, "Admin not found");
    if (admin.status != "pending") {
        throw new ApiError(
            400,
            `Admin registration has already been ${admin.status}`
        );
    }

    admin.status = action === "approve" ? "approved" : "rejected";
    admin.reviewedBy = req.user.officialId;
    await admin.save();

    const updatedAdmin = await Admin.findOne({ adminId }).select(
        "-password -RefreshToken"
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedAdmin,
                `Admin registered ${action}d successfully`
            )
        );
});


export { reviewAdminRegistration,registerOfficial };
