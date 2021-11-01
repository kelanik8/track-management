"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondWithWarning = exports.respondWithSuccess = void 0;
const respondWithSuccess = (res, statusCode = 200, message, additionalFields) => {
    res.status(statusCode).send({
        success: true,
        message,
        payload: additionalFields,
    });
};
exports.respondWithSuccess = respondWithSuccess;
const respondWithWarning = (res, statusCode = 500, message, additionalFields = {}) => {
    res.status(statusCode).send({
        success: false,
        message,
        payload: additionalFields,
    });
};
exports.respondWithWarning = respondWithWarning;
//# sourceMappingURL=responseHandler.js.map