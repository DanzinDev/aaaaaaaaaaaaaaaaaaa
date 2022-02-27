const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
  name: 'mcavatar',
  description: '[Minecraft] - Procure skins de jogadores do minecraft',
  options: [
    {
      name: "player",
      description: "Diga um nome de um player",
      type: "STRING",
      required: true
    }
  ],

  run: async (client, interaction, guild) => {
    const player = interaction.options.getString('player')

    let embed = new Discord.MessageEmbed()
      .setDescription(`**Skin de ${player}**\n[Aperte Aqui](https://mc-heads.net/body/${player})!`)
      .setImage(`https://mc-heads.net/body/${player}`)
      .setColor('RANDOM')
    interaction.reply({ embeds: [embed] })
  }
}