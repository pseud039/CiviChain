import { asyncHandler } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";

const getPendingOfficial = asyncHandler(async (req, res) => {
    if (req.user.role != "official") {
        throw new ApiError(403, "Only officials are allowed to view requests");
    }
    const { page = 1, limit = 10 } = req.query;

    const pendingAdmins = await Admin.find({ status: "pending" })
        .select("-password -RefreshToken")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });
    const totalPending = await Admin.countDocuments({ status: "pending" });
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                pendingAdmins,
                totalPending,
                currentPage: page,
                totalPages: Math.ceil(totalPending / limit),
            },
            "Pending official registerations retrieved Successfully"
        )
    );
});
const getRegistrationStatus = asyncHandler(async (req, res) => {});

export { getPendingOfficial, };
