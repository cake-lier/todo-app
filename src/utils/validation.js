"use strict";

class Error {
    static GeneralError = new Error(0, 500);
    static LoginError = new Error(1, 400);
    static PasswordError = new Error(2, 400);
    static LoginRequiredError = new Error(3, 401);
    static RequestError = new Error(4, 400);
    static ResourceNotFound = new Error(5, 404);

    constructor(code, status) {
        this.code = code;
        this.status = status;
    }
}

function validateRequest(request, response, bodyKeys = [], parametersKeys = [], needsLogin = false) {
    if (!parametersKeys.every(key => request.params[key] !== undefined)) {
        sendError(response, Error.RequestError);
        return false;
    }
    if (!bodyKeys.every(key => request.body[key] !== undefined)) {
        sendError(response, Error.RequestError);
        return false;
    }
    if (needsLogin && request.session.userId === undefined) {
        sendError(response, Error.LoginRequiredError);
        return false;
    }
    return true;
}

function sendError(response, error) {
    response.status(error.status).json({ error: error.code });
}

module.exports = {
    Error,
    validateRequest,
    sendError
}
