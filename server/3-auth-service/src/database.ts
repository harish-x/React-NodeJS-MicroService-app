import { winstonLogger } from "@harish-x/jobber-helpers";
import {Logger} from "winston";
import { config } from "./config";
import { Sequelize } from "sequelize";

const log:Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'jobber-auth-service','debug')

export const sequelize = new Sequelize('mysql://jobber:api@localhost:3306/jobber_auth',{
    dialect: "mysql",
    dialectOptions:{
        multipleStatements: true
    },
    });

export async function databaseConnection():Promise<void>{
    try{
        await sequelize.authenticate();
        log.info('Connection has been established successfully.');
    }catch(error){
        log.error('Unable to connect to the database:', error);
        log.log('error', 'Auth service databade error', error);
    }
}