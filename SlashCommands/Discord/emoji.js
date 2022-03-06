const Discord = require("discord.js");
const { parse } = require('twemoji-parser');

module.exports = {
  name: 'ampliar-emoji',
  description: '[Discord] - Amplie um emoji ou faça download do emoji que quer',
  options: [
    {
      name: "emoji",
      description: "coloque o emoji",
      type: "STRING",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const emoji = interaction.options.getString("emoji");

    let customemoji = Discord.Util.parseEmoji(emoji);

    if (customemoji.id) {
      const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
        customemoji.animated ? 'gif' : 'png'
        }`;
      return interaction.reply(`${Link}`);
    } else {
      let CheckEmoji = parse(emoji, { assetType: 'png' });
      if (!CheckEmoji[0]) return interaction.reply(`Dê-me um Emoji válido!`);
      interaction.reply(
        `Você pode usar o emoji normal sem adicionar no servidor!`
      );
    }
  }
};