const Discord = require("discord.js")
const settings =require("../../settings.json")
module.exports = {
  name: "eval",
  aliases: [],
  description: `Minhas informações`,
  run: async(client, message, args) => {

    if(!["692051255891329105", "429631941151686656", "924822579842273321"].includes(message.author.id)) {
      return message.channel.send(`> Apenas meus desenvolvedores podem utilizar esse comando!`)
    }
    const code = args.slice(0).join(" ")
    if (!code) return message.reply(`Digite algum codigo!`)

    try {

      let ev = require('util').inspect(eval(code))
      if (ev.length > 1950) {
        ev = ev.substr(0, 1950);
      }
      let embed = new Discord.MessageEmbed()
      .setColor('ORANGE')
      .setDescription(`:inbox_tray: **CODIGO:**\n\`\`\`js\n${code}\`\`\`\n:outbox_tray: **RESULTADO:**\n\`\`\`js\n${ev}\`\`\``)
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp()
      message.reply({embeds : [embed]})

    } catch(err) {

      let errorrr = new Discord.MessageEmbed()
      .setColor('RED')
      .setDescription(`:x: **ERRO DETECTADO!**\n\`\`\`\n${err}\`\`\``)
      message.reply({embeds : [errorrr]})

    }
  }
}