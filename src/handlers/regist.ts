import Parser from 'rss-parser';
import { format } from 'date-fns';

/**
 * 定数定義
 */
const parser: Parser = new Parser();
const logger = require('../../config/config');
const prisma = require('../../lib/prisma');
const NON_TGT_INSERT: number = 0;

/**
 * 型定義
 */
interface News {
    title: string;
    link: string;
    pub_date: string;
};


/**
 * RSSから取得したデータを登録する処理
 * @returns 登録件数
 */
const registNews = async (): Promise<number> => {
    // console.log('start registNews');
    logger.info('start registNews');
    const feed = await parser.parseURL(process.env.RSS_URL ?? 'https://example.com/');
    let insertTgtArray: Array<News> = [];
    for await (let item of feed.items) {
        let title: string = item.title ?? '';
        let link: string = item.link ?? '';
        let pubDate: string = item.pubDate ?? '';
        if(title == undefined || link == undefined || pubDate == undefined) {
            logger.error('no data!');
            continue;
        }
        let formattedDate: string = format(new Date(pubDate), 'yyyyMMdd');
        if(await isZeroCount(title, formattedDate)) {
            // 未登録のデータの場合はJSオブジェクトを追加する
            let tgtData: News = {
                title: title,
                link: link,
                pub_date:formattedDate
            };
            insertTgtArray.push(tgtData);
        }
    }
    // JSオブジェクトがnull以外の場合は登録処理を実行する
    if (insertTgtArray.length) {
        logger.info('end registNews');
        return insertData(insertTgtArray);
    } else {
        logger.info('end registNews');
        return NON_TGT_INSERT;
    }
}

module.exports = registNews;

/**
 * DBに登録済みデータか確認する
 * @param title 
 * @param pubDate 
 * @returns DB登録済み：true DB未登録：false
 */
async function isZeroCount(title: string, pubDate: string): Promise<boolean> {
    // console.log('start checkData');
    logger.info('start checkData');
    try {
        let result = await prisma.getClient.news.count({
            where: {
                title: title,
                pub_date: pubDate
            }
        });
        logger.info('end checkData');
        return result === 0;
    } catch (e) {
        logger.info('end checkData');
        logger.error(e);
        throw new Error('checkData error');
    }
}

/**
 * RSSから取得したデータをDBへ設定する
 * @param data 
 * @returns 登録件数
 */
async function insertData(data: Array<News>): Promise<number> {
    // console.log('start insertData');
    logger.info('start insertData');
    try {
        let result = await prisma.getClient.news.createMany({data});
        let insertDataCount: number = result.count;
        logger.debug(`登録件数 : ${insertDataCount}`);
        logger.info('end insertData');
        return insertDataCount;
    } catch (e) {
        logger.info('end insertData');
        logger.error(e);
        throw new Error('insertData error');
    }
}