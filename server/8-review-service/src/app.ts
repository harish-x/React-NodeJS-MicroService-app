import express, { Express } from "express";
import { start } from "@review/server";
import {databaseConnection} from "@review/database";

const initlize = async (): Promise<void> => {
    await databaseConnection();
    const app: Express = express();
    start(app);

}

initlize();