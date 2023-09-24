const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

// ライセンス情報を取得
const licenses = require("./license.json");

module.exports = {
  async execute(interaction) {
    // セレクトボックスを作る
    const select = new StringSelectMenuBuilder()
      .setCustomId("License-Check")
      .setPlaceholder("取得した資格を選んでください")
      .setOptions(
        licenses.map((license) => {
          // license.jsから資格情報を取得
          // それをmapで回し、セレクトボックスの中身として詰めている
          return new StringSelectMenuOptionBuilder()
            .setLabel(license.name)
            .setDescription(license.description)
            .setValue(String(license.id));
        })
      );

    // 作成したセレクトボックスをrowに格納
    const row = new ActionRowBuilder().addComponents(select);

    // リプライを返す
    await interaction.reply({
      content: "あなたの資格は？",
      components: [row],
    });
  },
};
