import { currentUsername, email, username } from "@users/controllers/buyer/get";
import { Router } from "express";
import express from "express";

const router:Router = express.Router();

const buyerRoutes = ()=>{
    router.get('/email',email);
    router.get('/username',currentUsername);
    router.get('/:username',username);
return router
}

export { buyerRoutes };