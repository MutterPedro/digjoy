import pino from 'pino';

import { PRODUCTION } from './environment';

const logger = pino({ name: 'digjoy', prettyPrint: { colorize: true }, level: PRODUCTION ? 'error' : 'debug' });
export default logger;
