import express from 'express';

/**
 * 定数定義
 */
const app: express.Express = express();
const logger = require('../config/config');
const prisma = require('../lib/prisma');
const registNews = require('./handlers/regist');

/**
 * ルーティング
 */
app.get('/regist-news',(req: express.Request,res: express.Response) => {
    logger.info('access /regist-news');
    registNews().then(async (insertCount: number) => {
        await prisma.disConnect();
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.write(JSON.stringify({ "code": "0","InsertDataCount": insertCount,"message": "Success" }));
        res.write('\n');
        res.end();
    }).catch(async (e: any) => {
        logger.error(e);
        await prisma.disConnect();
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.write(JSON.stringify({ "code": "1","message": "Error" }));
        res.write('\n');
        res.end();
        process.exit(1);
    });
});

// サーバー起動処理
if (prisma.connect()) {
    app.listen(process.env.PORT, ()=> {
        console.log('Server listen');
        logger.info('Server listen');
    });
}
