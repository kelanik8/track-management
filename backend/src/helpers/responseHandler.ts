import { Response } from "express";

export const respondWithSuccess = (
  res: Response<any, Record<string, any>>,
  statusCode = 200,
  message: string,
  additionalFields: any
): void => {
  res.status(statusCode).send({
    success: true,
    message,
    payload: additionalFields,
  });
};

export const respondWithWarning = (
  res: Response<any, Record<string, any>>,
  statusCode = 500,
  message: any,
  additionalFields: any = {}
) => {
  res.status(statusCode).send({
    success: false,
    message,
    payload: additionalFields,
  });
};


