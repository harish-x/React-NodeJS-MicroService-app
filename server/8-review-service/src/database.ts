import { winstonLogger } from '@harish-x/jobber-helpers';
import { Logger } from 'winston';
import { config } from '@review/config';
import {Pool} from 'pg';


const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'reviewDatabaseServer', 'debug');

const pool:Pool = new Pool({
  host: config.DATABASE_HOST!,
  user: config.DATABASE_USER!,
  password: config.DATABASE_PASSWORD!,
  database: config.DATABASE_NAME!,
  port: 5432
});

pool.on('error', (err) => {
  log.log('error', 'reviewService pool error:', err);
  process.exit(-1);
});

const createTableText = `
  CREATE TABLE IF NOT EXISTS public.reviews (
    id SERIAL UNIQUE,
    gigId text NOT NULL,
    reviewerId text NOT NULL,
    orderId text NOT NULL,
    sellerId text NOT NULL,
    review text NOT NULL,
    reviewerImage text NOT NULL,
    reviewerUsername text NOT NULL,
    country text NOT NULL,
    reviewType text NOT NULL,
    rating integer DEFAULT 0 NOT NULL,
    createdAt timestamp DEFAULT CURRENT_DATE,
    PRIMARY KEY (id)
  );

  CREATE INDEX IF NOT EXISTS gigId_idx ON public.reviews (gigId);

  CREATE INDEX IF NOT EXISTS sellerId_idx ON public.reviews (sellerId);
`;
const databaseConnection = async () => {
  try {
     await pool.connect()
     log.info('review server connected to database successfully...');
     pool.query(createTableText);
  } catch (error) {
    log.error('Connection to database failed. Retrying...');
    log.log('error', 'reviewService databaseConnection() method:', error);
  }
 
};

export { pool, databaseConnection };