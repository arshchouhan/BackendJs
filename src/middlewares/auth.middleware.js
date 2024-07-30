import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyjwt = asyncHandler(async(req,res,next)=>{
   try {
    const token=  req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer", "")
    if(!token)
    {
     throw new ApiError(401,"Unauthorized access")
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken).select("-password -refereshToken")
 
    if(!user)
    {
     throw new ApiError(401,"Invalid Access Token")
    }
    req.user=user
 
 nect()
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid Token")
   }
})