/**
 * log4js
 */
import log4js from 'log4js';
const config = require('./log4js-config.json');
log4js.configure(config);

module.exports = log4js.getLogger();
