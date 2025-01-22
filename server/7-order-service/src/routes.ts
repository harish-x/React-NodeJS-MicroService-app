import { Application } from "express";

import { verifyGatewayRequest } from "@harish-x/jobber-helpers";
import { healthRoutes } from "./routes/health";
import { orderRoutes } from "./routes/order";


const BASE_PATH = '/api/v1/order';

export function appRoutes(app:Application):void{
 app.use('',healthRoutes())   
  
 app.use(BASE_PATH,verifyGatewayRequest,orderRoutes())
}