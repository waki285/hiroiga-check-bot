# 拾い画チェックbot
Discord上での拾い画をチェックします。

## Credit
- [Twitter版拾い画チェックbot(本家様)](https://twitter.com/imgcheck)
- [本家開発者様](https://twitter.com/iruca_bb)
- [拾い画チェッカー ホームページ](https://imgcheck.irucabot.com/)

[BOT招待](https://discord.com/api/oauth2/authorize?client_id=925551810415054879&permissions=84992&scope=bot%20applications.commands)

## 使い方
画像があるメッセージに返信でメンションするか、
![image](https://i.imgur.com/69pTijO.png)

「アプリ」から「チェック」もしくは「ゴーストチェック」を選んでください。

![image2](https://i.imgur.com/vf28kkJ.png)

「ゴーストチェック」は、他人に見えないようにチェックすることが可能です。

![image3](https://i.imgur.com/QDOtGBC.png)


## セルフホスト
Node.js v16以降の環境が必要です。

1. `git clone https://github.com/waki285/hiroiga-check-bot.git`
1. `cd hiroiga-check-bot`
1. `npm install`
1. `npm run regist アプリケーションコマンドを登録したいサーバーID`
1. `.env.example` を `.env` に改名し、`BOT_TOKEN=`の部分に貴方のBotのTOKENを入れる
1. `npm start`