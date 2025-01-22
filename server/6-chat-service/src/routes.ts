import { Application } from "express";

import { verifyGatewayRequest } from "@harish-x/jobber-helpers";
import { healthRoutes } from "@chat/routes/health";
import { messageRoutes } from "@chat/routes/message";


const BASE_PATH = '/api/v1/message';

export function appRoutes(app:Application):void{
 app.use('',healthRoutes())   
  
 app.use(BASE_PATH,verifyGatewayRequest,messageRoutes())
}