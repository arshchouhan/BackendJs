import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCLodinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
    //taking user details from the frontend
    //validating for empty field
    //user already registered or not
    //check for images , check for path
    //upload them to cloudinary
    //create user object and add it to database
    //remove password and refresh token from the returned response
    //return response
     const {fullname,email,password,username} = req.body
     if([fullname,email,password,username].some((field)=> field?.trim()===""))
     {
        throw new ApiError(400,"All fields are required")
     }
     
     const existedUser= await User.findOne(
        {
            $or:[{ username },{ email }]
        }
      )

     if(existedUser)
     {
        throw new ApiError(409,"User with username or email already exists")
     }
     
     const avatarLocalPath = req.files?.avatar[0]?.path;
     const coverImageLocalPath = req.files?.coverImage[0]?.path;
     
     if(! avatarLocalPath)
     {
        throw new ApiError(400,"Avatar is required")
     }

     const avatar = await uploadOnCLodinary(avatarLocalPath)
     const coverImage = await uploadOnCLodinary(coverImageLocalPath)

     if(!avatar)
   {
        throw new ApiError(400,"Avatar is required")
     }

     const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url  || "",
        email,
        password,
        username
     })
     console.log(user)
     const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
     )
    
     if(!createdUser)
     {
        throw new ApiError(500,"Something went wrong while registering the user")
     }        

     return res.status(201).json
     ( 
      new ApiResponse(200,createdUser,"User registered successfully")
   )
})



export {registerUser}
