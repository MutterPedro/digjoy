import pino from 'pino';

import { name } from '../../package.json';
import { PRODUCTION } from './environment';

const logger = pino({ name, prettyPrint: { colorize: true }, level: PRODUCTION ? 'error' : 'debug' });
export default logger;
