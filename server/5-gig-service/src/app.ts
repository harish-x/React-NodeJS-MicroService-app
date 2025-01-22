import express, { Express } from "express";
import { start } from "@gig/server";
import { databaseConnection } from "./database";
import { config } from "./config";
import { redisConnect } from "@gig/redis/redis.connection";

const initlize = async (): Promise<void> => {
    config.cloudinaryConfig();
    const app: Express = express();
    await databaseConnection();
    start(app);
    redisConnect()
}

initlize();