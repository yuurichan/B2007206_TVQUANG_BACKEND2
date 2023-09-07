class ApiError extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.errMessage = message;
    }
}

module.exports = ApiError;