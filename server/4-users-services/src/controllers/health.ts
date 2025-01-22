import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function health(_req: Request, res: Response) {
 
    res.status(StatusCodes.OK).send("users service is healthy and OK.");

}