import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, '.env') });

if (process.env.ENABLE_APM === '1') {
    require('elastic-apm-node').start({
      serviceName: 'jobber-gateway',
      serverUrl: process.env.ELASTIC_APM_SERVER_URL,
      secretToken: process.env.ELASTIC_APM_SECRET_TOKEN,
      environment: process.env.NODE_ENV,
      active: true,
      captureBody: 'all',
      errorOnAbortedRequests: true,
      captureErrorLogStackTraces: 'always'
    });
  }

class Config {
    public NODE_ENV: string;
    public CLIENT_URL: string;
    public RABBITMQ_ENDPOINT: string;
    public SENDER_EMAIL: string;
    public SENDER_EMAIL_PASSWORD: string;
    public ELASTIC_SEARCH_URL: string;

    constructor() {
        this.NODE_ENV = process.env.NODE_ENV || "";
        this.CLIENT_URL = process.env.CLIENT_URL || "";
        this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || "";
        this.SENDER_EMAIL = process.env.SENDER_EMAIL || "";
        this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || "";
        this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || "";
    }
}

export const config: Config = new Config();
