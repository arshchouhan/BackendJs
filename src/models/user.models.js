import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true// used for searching
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        lowercase:true,
        index:true// used for searching
    },
    avatar:{
        type:String ,//cludinary URL
        required:true
    },
    coverImage:{
        type:String 
    },
    watchHistory:[{
        type:Schema.types.ObjectId,
        ref:"Video"
    }],
    password:{
        type:String,
        required:[true,"Password is required"]

    },
    refreshToken:{
        type:String
    }
},{timestamps:true}) 


userSchema.pre("save", function(next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hash(this.password,10)
})

userSchema.methods.isPasswordCorrect = async function(password)
{
    return bcrypt.compare(password,this.password)
}

userSchema.methods.gnerateAccessToken = function() {
    jwt.sign({
        _id:this._id,
        email:this.email,
        fullname:this.fullname,
        username:this.username
    },
process.env.ACCESS_TOKEN_SECRET,
{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY
})
}
userSchema.methods.gnerateRefreshToken = function() {
    jwt.sign({
        _id:this._id
    },
process.env.Refresh_TOKEN_SECRET,
{
    expiresIn:process.env.Refresh_TOKEN_EXPIRY
})
}
export const User = mongoose.model("User","userSchema")