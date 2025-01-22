import express from 'express';
import { winstonLogger } from '@harish-x/jobber-helpers';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { start } from '@notifications/server';


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-app', 'debug');

function initialize(): void {
    const app = express();
    start(app);
    log.info('Notification service has initialized');

}

initialize();