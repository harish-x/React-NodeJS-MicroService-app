import { Client } from '@elastic/elasticsearch';
import { ClusterHealthResponse, CountResponse, GetResponse } from '@elastic/elasticsearch/lib/api/types';
import { config } from '@gig/config';
import {  ISellerGig, winstonLogger } from '@harish-x/jobber-helpers';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gigElasticSearchServer', 'debug');

export const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`
});

async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    log.info('gigService connecting to ElasticSearch...');
    try {
      const health: ClusterHealthResponse = await elasticSearchClient.cluster.health({});
      log.info(`gigService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'gigService checkConnection() method:', error);
    }
  }
}
async function checkIfIndexExist(indexName: string): Promise<boolean> {
  const result: boolean = await elasticSearchClient.indices.exists({ index: indexName });
  return result;
}

async function createIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await checkIfIndexExist(indexName);
    if (result) {
      log.info(`Index "${indexName}" already exist.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error occurred while creating the index ${indexName}`);
    log.log('error', 'AuthService createIndex() method error:', error);
  }
}

const getDocumentCount = async (index: string): Promise<number> => {
  try {
    const result: CountResponse = await elasticSearchClient.count({ index });
    return result.count;
  } catch (error) {
    log.log('error', 'GigService elasticsearch getDocumentCount() method error:', error);
    return 0;
  }
};

const getIndexedData = async (index:string,itemId:string) :Promise<ISellerGig> =>{
  try {
    const result:GetResponse = await elasticSearchClient.get({
      index: index,
      id: itemId
    })
    return result._source as ISellerGig
  } catch (error) {
    log.log('error', 'GigService getIndexedData() method error:', error);
    return {} as ISellerGig;
  }
}

const addDataToIndex = async (index:string,itemid:string,gigDocument:unknown) :Promise<void> =>{
  try {
   await elasticSearchClient.index({
     index: index,
     id: itemid,
      document:gigDocument
   })
 
  } catch (error) {
    log.log('error', 'GigService addDataToIndex() method error:', error);
   
  }
}

const updateIndexedData = async (index: string, itemId: string, gigDocument: unknown): Promise<void> => {
  try {
    await elasticSearchClient.update({
      index,
      id: itemId,
      doc: gigDocument
    });
  } catch (error) {
    log.log('error', 'GigService elasticsearch updateIndexedData() method error:', error);
  }
};

const deleteIndexedData = async (index: string, itemId: string): Promise<void> => {
  try {
    await elasticSearchClient.delete({
      index,
      id: itemId
    });
  } catch (error) {
    log.log('error', 'GigService elasticsearch deleteIndexedData() method error:', error);
  }
};

export { checkConnection,createIndex,getIndexedData,addDataToIndex,updateIndexedData,deleteIndexedData,getDocumentCount };