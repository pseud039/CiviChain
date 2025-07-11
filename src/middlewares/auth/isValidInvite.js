import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/errorHandler.js";
import { Invite } from "../../models/invite.model.js";

export const verifyInviteToken = asyncHandler(async (req, res,next) => {
    const { token } = req.params;
    if (!token) {
        throw new ApiError(403, "Unauthorized Access");
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const validInvite = await Invite.findOne({_id:decodedToken._id,isUsed:false});
    console.log(validInvite);
    if (!validInvite) {
        throw new ApiError(400, "Invitation has already been used or is invalid");
    }
    req.inviteData = {
        inviteId: validInvite._id,
        email:validInvite.email,
        name:validInvite.name,
        token:validInvite.token,
    }
    next();
});
