import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCLodinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefereshToken = async(userId) =>
{
   try{
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refereshToken = user.generateRefreshToken ()
      user.refereshToken = refereshToken
      await user.save({validateBeforeSave:false})
      return { accessToken, refereshToken}
   }catch(error)
   {
      throw new ApiError(500,"Something went wrong while generating acccess and refresh token")
   }
}

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

const loginUser= asyncHandler(async(req,res)=>{
   const {email,username,password}= req.body
   if(!username || ! email)
   {
      throw new ApiError(400,"Email or Username required")
   }
   const user = await User.findOne({
      $or:[{username},{email}]
   })
   if(!user)
   {
      throw new ApiError(400,"user not found")
   }
   const isPsswordValid = await user.isPasswordCorrect (password)
   if(!isPsswordValid)
      {
         throw new ApiError(400,"invalid user credentials")
      }
      const {accessToken ,  refereshToken} = await user.generateAccessAndRefereshToken(user._id)

      const options= {
         httpOnly:true, 
         secure : true
      }

      return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refereshToken", refereshToken, options)
      .json(
         new ApiResponse(200,
            {
               user:accessToken,refereshToken
            },
            "User loggedin succesfully"
         )
      )
})

const logoutUser = asyncHandler(async(req,res)=>
{
   await User.findByIdAndUpdate(req.user._id,
      {
         $set:{
            refereshToken:undefined
         }
      },
      {
         new:true
      }
   )
   const options = {
      httpOnly:true,
      secure:true
   }

   return res.status(200)
   .clearCookie("accessToken")
   .clearCookie("refereshToken")
   .json(
      new ApiResponse(200,{},"User Logged Out")
   )
})



export {registerUser,loginUser,logoutUser}
