const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
} = require("discord.js");

// ライセンス情報を取得
const licenses = require("./license.json");

module.exports = {
  async execute(interaction) {
    const select = new StringSelectMenuBuilder()
      .setCustomId("License-Check")
      .setPlaceholder("Place-holder")
      .setOptions(
        licenses.map((license) => {
          return new StringSelectMenuOptionBuilder()
            .setLabel(license.name)
            .setDescription(license.description)
            .setValue(String(license.id));
        })
      );

    const row = new ActionRowBuilder().addComponents(select);

    await interaction.reply({
      content: "あなたの資格は？",
      components: [row],
    });
  },
};
