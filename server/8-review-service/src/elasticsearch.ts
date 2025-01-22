import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse} from '@elastic/elasticsearch/lib/api/types';
import { config } from '@review/config';
import {   winstonLogger } from '@harish-x/jobber-helpers';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'ReviewElasticSearchServer', 'debug');

export const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    log.info('ReviewService connecting to ElasticSearch...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`ReviewService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'ReviewService checkConnection() method:', error);
    }
  }
}

export { checkConnection };