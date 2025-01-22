import { winstonLogger } from '@harish-x/jobber-helpers';
import { Logger } from 'winston';
import { config } from '@chat/config';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'chatDatabaseServer', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.DATABASE_URL}`);
    log.info('chat service successfully connected to database.');
  } catch (error) {
    log.log('error', 'chatService databaseConnection() method error:', error);
  }
};

export { databaseConnection };