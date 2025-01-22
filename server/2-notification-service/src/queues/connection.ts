import client, { Channel, Connection } from 'amqplib';
import { winstonLogger } from '@harish-x/jobber-helpers';
import { Logger } from 'winston';
import { config } from '@notifications/config';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-queue-connection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
    try {
        const connection: Connection = await client.connect(config.RABBITMQ_ENDPOINT);
        const channel: Channel = await connection.createChannel();
        log.info('Notification queue connection established');

        closeConnection(channel, connection);

        return channel;
    } catch (error) {
        log.error('notification-queue-connection', error);
    }
}

function closeConnection(channel: Channel, connection: Connection): void {
    process.once('SIGINT', async () => {
        try {
            await channel?.close();
            await connection.close();
            log.info('Notification queue connection closed gracefully');
        } catch (error) {
            log.error('Error closing connection:', error);
        }
    });
}

export { createConnection };
