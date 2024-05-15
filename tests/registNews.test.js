const { registNews } = require('../src/app'); // テスト対象の関数をインポートする

// テスト用のRSSフィードのダミーデータ
const dummyFeedItems = [
    { title: 'Test News 1', link: 'http://example.com/news1', pubDate: '2024-05-01T12:00:00Z' },
    { title: 'Test News 2', link: 'http://example.com/news2', pubDate: '2024-05-02T12:00:00Z' },
    // 他のフィードアイテムも追加可能
];

// Prismaの関数をモック化
jest.mock('../lib/prisma', () => ({
    getClient: {
        news: {
            count: jest.fn().mockResolvedValue(0) // count関数をモック化して0を返す
        }
    },
    disConnect: jest.fn().mockResolvedValue(undefined) // disConnect関数をモック化してundefinedを返す
}));

// Parserをモック化
jest.mock('rss-parser', () => ({
    parseURL: jest.fn().mockResolvedValue({
        items: dummyFeedItems // テスト用のフィードアイテムを返す
    })
}));

describe('registNews function', () => {
    it('should regist news from RSS feed and return count of inserted data', async () => {
        const result = await registNews(); // registNews関数を実行
        expect(result).toBe(2); // テスト用のRSSフィードに2つのアイテムがあるので、2が返ってくることを期待する
    });
});
