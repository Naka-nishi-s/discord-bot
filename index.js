// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const {
  Client,
  Events,
  GatewayIntentBits,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

// 資格一覧を取得
const select = require("./select");

// ライセンス情報を取得
const licenses = require("./license.json");

// 設定ファイルからトークン情報を呼び出し、変数に保存します
const { token } = require("./config.json");

// 資格マイルストーン数
let mile = 0;

// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, (c) => {
  console.log(`準備OKです! ${c.user.tag}がログインします。`);
});

client.on(Events.MessageCreate, async (message) => {
  // Botの発言はreturn
  if (message.author.bot) return;

  if (message.content.includes("@資格")) {
    select.execute(message);
  }
});

// プルダウンリストを選んだ後の挙動
client.on(Events.InteractionCreate, async (interaction) => {
  // 選んだプルダウンリストのカスタムIDをチェック
  if (interaction.customId === "License-Check") {
    // 返ってきたid(文字列型)を数値で取得
    const licenseValue = parseInt(interaction.values[0], 10);

    // 資格一覧のjsonをidで検索
    const selectedLicense = licenses.find(
      (license) => license.id === licenseValue
    );

    // ポイントの加算
    if (selectedLicense) {
      mile += selectedLicense.points;
    }

    // 100を超えたら100を減算して、抽選開始
    let addText = "";
    if (mile >= 100) {
      mile -= 100;
      addText += "\n\n今回は100点を超えたので、抽選を行います。";
    }

    ////////////////////////////////////////
    ////////////////////////////////////////
    ////////////////////////////////////////
    ////////////////////////////////////////
    ////////////////////////////////////////
    ////////////////////////////////////////
    ////////////////////////////////////////
    // ここから書く
    // 抽選処理書きたいけど、リプライは１つしか許容されないから気をつけてね。
    // 抽選結果をreplayTextにまとめる形がいいかな？

    if (!addText) {
      // 抽選処理
      lottery();
    }

    // リプライ用テキスト作成
    let replyText = `合格おめでとうございます！\n\nマイルストーンに${selectedLicense.points}が加算されました。\n\n現在のマイルストーンは${mile}です。${addText}`;

    // リプライする
    interaction.reply(replyText);
  }
});

// マイルストーンのリセット

// ログインします
client.login(token);
