// Promise Method
const asyncHandler = (requestHandler) =>{
    (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=> next(err))
    }
}


//Try Catch Method

// const asyncHandler = (requestHandler) => async (req,res,next) =>{
//     try{
//         await requestHandler(req,res,next)
//     }
//     catch(error){
//         res.send(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }