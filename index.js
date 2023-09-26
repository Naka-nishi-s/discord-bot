// discord.jsライブラリの中から必要な設定を呼び出し、変数に保存します
const { Client, Events, GatewayIntentBits } = require("discord.js");

const { insertUserId, selectAllUser, cleanUserTable } = require("./database");

// 資格一覧を取得
const select = require("./select");

// ライセンス情報を取得
const licenses = require("./license.json");

// 設定ファイルからトークン情報を呼び出し、変数に保存します
const { token } = require("./config.json");

// 資格マイルストーン数
let mile = 0;

// 話しかけた人
let speakerID;

// ギルドメンバー
let guildMember;

// 入力中フラグ
let isTyping = false;

// クライアントインスタンスと呼ばれるオブジェクトを作成します
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// クライアントオブジェクトが準備OKとなったとき一度だけ実行されます
client.once(Events.ClientReady, (c) => {
  console.log(`準備OKです! ${c.user.tag}がログインします。`);
});

client.on(Events.MessageCreate, async (message) => {
  // Botの発言はreturn
  if (message.author.bot) return;

  // Bot以外の人が話したら反応する
  if (message.content.includes("資格取得")) {
    // 誰かが入力中だったら無視
    if (isTyping) return;

    // 入力中フラグをOn
    isTyping = true;

    // 現在のギルドを取得
    const guild = message.guild;

    // ギルド内のメンバー情報をリストで取得
    const members = guild.members.cache;
    guildMember = members
      .filter((member) => !member.user.bot)
      .map((noBotMember) => {
        return {
          id: noBotMember.user.id,
          userName: noBotMember.user.globalName,
        };
      });

    // 話し手のIDを保持
    speakerID = message.author.id;

    // セレクトボックスの表示
    select.execute(message);
  }
});

/**
 * 抽選処理
 * @returns userName 当選した人の名前
 */
const lottery = async () => {
  // 全ユーザーを取得
  const responseData = await selectAllUser();

  // エラーがあれば終了
  if (responseData.errMsg) return;

  // ユーザーIDのみのリストにする
  const userList = responseData.data.map((userData) => userData.user_id);

  // 1人選ぶ
  const luckyId = userList[Math.floor(Math.random() * userList.length)];

  // 全ユーザーの中からIDで検索する
  const luckyUser = guildMember.find((member) => member.id === luckyId);

  // DBのクリーンアップ
  const response = cleanUserTable();

  // エラーがあれば終了
  if (response.errMsg) return;

  // 選ばれたユーザーの名前を返す
  return luckyUser.userName;
};

// プルダウンリストを選んだ後の挙動
client.on(Events.InteractionCreate, async (interaction) => {
  // 選んだプルダウンリストのカスタムIDをチェック
  if (interaction.customId === "License-Check") {
    // ユーザーをDBに格納
    const errText = await insertUserId(speakerID);

    // エラーがあれば、エラー内容をリプライして終了
    if (errText) return interaction.reply(errText);

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

    // 100を超えたら抽選開始、抽選完了後に100を減算
    let addText = "";
    if (mile >= 100) {
      // 抽選を行う
      const luckyName = await lottery();
      mile -= 100;
      addText += `\n\n今回は100点を超えたので、抽選を行います。\n抽選の結果...${luckyName}が当選しました！`;
    }

    // リプライ用テキスト作成
    let replyText = `合格おめでとうございます！\nマイルストーンに${selectedLicense.points}が加算されました。\n\n現在のマイルストーンは${mile}です。${addText}`;

    // リプライする
    interaction.reply(replyText);

    // 入力中フラグをOff
    isTyping = false;
  }
});

// ログインします
client.login(token);
