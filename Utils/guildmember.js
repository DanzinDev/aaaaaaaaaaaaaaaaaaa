const Discord = require("discord.js")

function alterarMsg(guildMember, message) {

  message = message.replace(/\[username\]/g, guildMember.user.username)
  message = message.replace(/\[usertag\]/g, guildMember.user.tag)
  message = message.replace(/\[userid\]/g, guildMember.id)
  message = message.replace(/\[guildname\]/g, guildMember.guild.name)
  message = message.replace(/\[guildid\]/g, guildMember.guild.id)
  message = message.replace(/\[membercount\]/g, guildMember.guild.memberCount)

  return message;
}

function messageMemberLog(guildMember, canal, titulo, message, cor) {

  /*console.log(canal)
  console.log(titulo)
  console.log(message)
  console.log(cor)
  console.log(guildMember)
  */

  if (!canal) return

  let embed = new Discord.MessageEmbed()
  .setColor('GREEN')

  if (titulo) {

    titulo = alterarMsg(guildMember, titulo)

    embed.setTitle(titulo)

  }

  if (message) {

    message = alterarMsg(guildMember, message)
    embed.setDescription(message)

  }

  try {
    canal.send({ content: guildMember.toString(), embeds: [embed] })
    //canal.send(guildMember.user.username)
    //console.log(message)
  } catch (err) {
    return;
  }

}

module.exports.messageMemberLog = messageMemberLog;
module.exports.alterarMsg = alterarMsg;