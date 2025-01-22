import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@harish-x/jobber-helpers';
import { Logger } from 'winston';
import { config } from '@auth/config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'Auth-queue-connection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
    try {
        const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
        const channel: Channel = await connection.createChannel();
        log.info('Auth queue connection established');

        closeConnection(channel, connection);
        return channel;
    } catch (error) {
        log.error('Auth-queue-connection', error);
        return undefined    
    }
}

function closeConnection(channel: Channel, connection: Connection): void {
    process.once('SIGINT', async () => {
            await channel?.close();
            await connection.close();
            log.info('Auth queue connection closed gracefully');
       
    });
}

export { createConnection };
