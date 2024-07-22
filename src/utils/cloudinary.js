import {v2 as clodinary} from "cloudinary"
import fs from "fs"

import { v2 as cloudinary } from 'cloudinary';
import { response } from "express";



// Configuration
cloudinary.config({ 
        cloud_name: process.env.CLODINARY_CLOUD_NAME, 
        api_key: process.env.CLODINARY_API_KEY, 
        api_secret: process.env.CLODINARY_API_SECRET
    });
const uploadOnCLodinary = async (localFilePath) =>{
    try {
        if(!localFilePath) return null
        //upload file on cloudinary
        const response= await cloudinary.uploader.upload(localFilePath,
            {
                resource_type:"auto"
            }
        )
        console.lof("File uploaded on cloudinary",response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)// remove localy saved file if the upload operation fails
        return null
    }
}
export {uploadOnCLodinary}
    