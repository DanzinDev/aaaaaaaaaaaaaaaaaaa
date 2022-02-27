const Discord = require("discord.js")
const settings = require("../../settings.json")
var admin = require("firebase-admin");
let database = admin.database();
module.exports = {
  name: "blacklist",
  aliases: [],
  run: async (client, message, args) => {
    if (!settings.adm_id.includes(message.author.id)) {
      return message.channel.send(`> Apenas meus desenvolvedores podem utilizar esse comando!`)
    }

    let user = client.users.cache.get(args[0]);
    let motivo = args[1] || `Deve ter feito alguma coisa feia >:(`

let canal = client.channels.cache.get(`912964136995008522`)

    let error = new Discord.MessageEmbed()
      .setTitle(`❓ Informação sobre o comando`)
      .setDescription(`*Banir alguem de usar o foxy*`)
      .addField(`:hammer: **Uso**`, `\`f!blacklist <@user>\``)
      .setColor('RED')

    if (!user) return message.channel.send({ embeds: [error] });

    let fetched = await database.ref(`user/${user.id}/blacklist`).once('value')
    fetched = fetched.val()

    if (!fetched) {
      await database.ref(`user/${user.id}/blacklist`).set(true)
      message.channel.send(`🚫 **${user.tag} foi banido(a) com sucesso**`)
      client.channels.cache.get(`912964136995008522`).send(`🚫 **${user.tag} foi banido(a)\nele(a) não pode mais usar meus comandos!**\n\n**Motivo do banimento:**\n\`${motivo}\``)
    } else {

      await database.ref(`user/${user.id}/blacklist`).set(false)

      message.channel.send(`✅ **${user.tag} foi desbanido(a) com sucesso**`)
      client.channels.cache.get(`912964136995008522`).send(`✅ **${user.tag} foi desbanido(a)\nele(a) pode usar meus comandos novamente**`)
    }
  }
}