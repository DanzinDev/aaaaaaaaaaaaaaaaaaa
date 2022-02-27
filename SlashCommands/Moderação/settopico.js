const Discord = require('discord.js')
module.exports = {
  name: 'set-topico',
  description: '[Moderação] - Defina um topico para o canal',
permission: 'MANAGE_CHANNELS',
  options: [
 {
      name: "canal",
      description: "Coloque um canal",
      type: "CHANNEL",
      channelTypes: ['GUILD_TEXT'],
      required: true
    },
    {
      name: "topico",
      description: "Escreva algo",
      type: "STRING",
      required: true
    }
  ],

  run: async (client, interaction, guild) => {
const canal = interaction.options.getChannel("canal");
const topico = interaction.options.getString("topico");

if (!guild.me.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply(`:x: Eu preciso ter permissão de **gerenciar canais** para alterar o topico`)
        }
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply(`:x: Você precisa ter permissão de **gerenciar canais** para alterar o topico`)
        }

canal.setTopic(topico).then(() => {

      let embed = new Discord.MessageEmbed()
       .setTitle(`✅ Novo topico de canal definido`)
       .setDescription(`O topico do canal: **${canal.name}** foi definido para: **${topico}**`)
       .setColor(`GREEN`)
    interaction.reply({ embeds: [embed] })
})
  }
}