# regist-news

## 概要
- 指定したRSSを取得して以下を取得する
    - 記事タイトル
    - 記事リンク
    - 配信日時（yyyymmdd）
- 取得した情報をDBへ設定する

## 配置準備
### .env
- プロジェクトルート直下に配置してください。
    ~~~
    DATABASE_URL="prismaで使用するDBのURL"
    RSS_URL="取得対象のRSSURL（想定はyahooニュース）"
    PORT="ポート番号"
    ~~~

### node_modules
- 以下のコマンドを発行
    ~~~
    npm install
    ~~~

### サーバーを起動
- 以下のコマンドを発行(nodemonが実行されます
    ~~~
    npm start
    ~~~
