class ApiError extends Error{
    constructor(
        statusCode,
        Message = "Something Went Wrong",
        errors = [],
        statck=""


    ){
        super(message)
        this.statusCode=statusCode
        this.data=null
        this.message=this.message
        this.success=false
        this.errors=errors
    }
}

export {ApiError}