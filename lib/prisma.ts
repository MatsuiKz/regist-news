import { PrismaClient } from '@prisma/client';
let prisma:PrismaClient = new PrismaClient();

const logger = require('../config/config');

exports.getClient = prisma;

exports.connect = () => {
    if (!prisma) {
        prisma = new PrismaClient();
    }
    logger.debug('prisma START connect');
    return prisma.$connect;
};

exports.disConnect = () => {
    logger.debug('prisma END connect');
    return prisma.$disconnect;
}
