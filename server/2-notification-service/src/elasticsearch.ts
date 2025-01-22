import { Client } from '@elastic/elasticsearch';
import { config } from '@notifications/config';
import { winstonLogger } from '@harish-x/jobber-helpers';
import { Logger } from 'winston';
import { ClusterHealthResponse } from '@elastic/elasticsearch/lib/api/types';

const ELASTIC_URL = config.ELASTIC_SEARCH_URL as string;

const log: Logger = winstonLogger(ELASTIC_URL, 'notificationElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: ELASTIC_URL,
  maxRetries: 5,
  requestTimeout: 60000,
  auth: {
    username: '',
    password: ''
  }
});

export async function checkConnection(): Promise<void> {
  try {

    const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
    log.info(`Notification service elastic search health status is ${health.status}`);
  } catch (error) {
    console.error('Detailed Elasticsearch connection error:', error);
    log.error('Elasticsearch connection failed', error);
  }
}


