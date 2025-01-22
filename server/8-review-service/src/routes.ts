import { Application } from "express";

import { verifyGatewayRequest } from "@harish-x/jobber-helpers";
import { healthRoutes } from "./routes/health";
import { reviewRoutes } from "./routes/review";



const BASE_PATH = '/api/v1/review';

export function appRoutes(app:Application):void{
 app.use('',healthRoutes())   
  
 app.use(BASE_PATH,verifyGatewayRequest,reviewRoutes())
}