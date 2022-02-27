const Discord = require('discord.js');
const moment = require("moment")
moment.locale('pt-BR')

module.exports = {
  name: 'channelinfo',
  description: '[Discord] - Informações sobre algum canal do servidor',
  options: [
    {
       name: "canal",
      description: "Coloque um canal",
      type: "CHANNEL",
      channelTypes: ['GUILD_TEXT'],
      required: true
    }
  ],
  run: async (client, interaction, guild) => {

  const canal = interaction.options.getChannel("canal");
  let nome = canal.name
    let tipo = canal.type
    let topico = canal.topic || 'Nenhum topico definido'
    let id = canal.id
    let nsfw = canal.nsfw
    if(nsfw == true) nsfw = "Sim"
    else nsfw = "Não"
    let memb = canal.members.size
    let cria = moment(canal.createdTimestamp).format('LLLL')
    let criado = moment(canal.createdTimestamp).fromNow()
    let mem = `\`<#${id}>\``
    const embed = new Discord.MessageEmbed() 
    .setTimestamp()
    .addField(`📋 Nome:`, `\`${nome}\``)
    .addField("🗒️ Topico:", `\`${topico}\``)
    .addField(`🗂️ Tipo:`, `\`[${canal.type == "text" ? "Chat de texto" : "Chat de voz"}]\``)
    .addField("🆔 ID do chat:", `\`${id}\``)
    .addField("🔔 Menção:", `${mem}`)
    .addField("🔞 NSFW:", `\`${nsfw}\``)
    .addField("👥 Membros que podem ver:", `\`${memb} membros\``)
    
    .setColor("GREEN")
    .setThumbnail(guild.iconURL({dynamic: true}))
    interaction.reply({ embeds: [embed] })
  }
};