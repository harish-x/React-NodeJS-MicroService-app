import express, { Express } from "express";
import { start } from "@chat/server";
import { databaseConnection } from "./database";
import { config } from "./config";


const initlize = async (): Promise<void> => {
    config.cloudinaryConfig();
    const app: Express = express();
    await databaseConnection();
    start(app);

}

initlize();