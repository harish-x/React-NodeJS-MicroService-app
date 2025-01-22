import { Application } from "express";

import { verifyGatewayRequest } from "@harish-x/jobber-helpers";
import { gigRoutes } from "./routes/gig";
// import { buyerRoutes } from "@gig/routes/buyer";
import { healthRoutes } from "@gig/routes/health";

const BASE_PATH = '/api/v1/gig';

export function appRoutes(app:Application):void{
 app.use('',()=>console.log('hello'))   
 app.use('',healthRoutes())   
 app.use(BASE_PATH,verifyGatewayRequest,gigRoutes())   
//  app.use(SELLER_BASE_PATH,verifyGatewayRequest,()=>{})
}