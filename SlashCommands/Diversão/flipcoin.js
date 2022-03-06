const Discord = require("discord.js");

let actionRow = new Discord.MessageActionRow()
  .addComponents(
    new Discord.MessageButton()
      .setCustomId('Coroa')
      .setLabel('Coroa')
      .setEmoji("949742759013650532")
      .setStyle('PRIMARY'),
    new Discord.MessageButton()
      .setCustomId('Cara')
      .setLabel('Cara')
      .setEmoji("949742688046030889")
      .setStyle('PRIMARY')
  );

module.exports = {
  name: 'flipcoin',
  description: '[Discord] - Informações sobre o emoji do servidor',
  run: async (client, interaction, guild) => {

    let escolha = new Discord.MessageEmbed()
      .setTitle(`ESCOLHA`)

    const reply = await interaction.reply({
      embeds: [escolha],
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {

      const values = ['Cara', 'Coroa'];
      const emojis = ['<:Cara:949742688046030889>', '<:Coroa:949742759013650532>'];

      const player = values.indexOf(i.customId);

      const playerValue = values[player];
      const playerEmoji = emojis[player];

      const bot = Math.floor(Math.random() * 2);

      const botValue = values[bot];
      const botEmoji = emojis[bot];

      let resultEmbed = new Discord.MessageEmbed()

      let description = `Você jogou: **${playerValue} ${playerEmoji}**\n\nEu joguei: **${botValue} ${botEmoji}**\n\n`


      if (playerValue == botValue) {
        resultEmbed.setColor('YELLOW');
        description += 'Foi um empate! 🤝';

      } else if (
        (playerValue == 'Coroa' && botValue == 'Cara') ||
        (playerValue == 'Cara' && botValue == 'Coroa')
      ) {
        resultEmbed.setColor('GREEN');
        description += `🎉 Parabéns ${interaction.user}, você venceu!\n\n😭 Infelizmente, eu perdi`;

      } else {
        resultEmbed.setColor('RED');
        description += `😭 Sinto muito ${interaction.user}, você perdeu...\n\n🎉 Eba, eu venci!`

      }
      resultEmbed.setDescription(description)

      i.update({ embeds: [resultEmbed], components: [actionRow] })

    })
  }
}