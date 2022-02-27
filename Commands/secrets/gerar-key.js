const Discord = require('discord.js');
const fs = require("fs");
const settings = require("../../settings.json")
const admin = require("firebase-admin");
const database = admin.database();

function makeid(length) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
let code = makeid(16)
module.exports = {
  name: "gerar-key",
  aliases: [],
  description: `Gerar chaves de codigos`,
  run: async (client, message, args) => {
    const member = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author
    let keysDir = `bot/keys`

    if (!["692051255891329105", "429631941151686656"].includes(message.author.id)) {
      return message.channel.send(`> Apenas meus desenvolvedores podem utilizar esse comando!`)
    }
    await database.ref(keysDir + "/" + code).set(true)
    let codigo_pronto = new Discord.MessageEmbed()
      .setDescription(`\`\`\`${code}\`\`\``)
    return member.send({ content: `**🥳 Parabéns, Você acaba de ganhar um codigo de premium no foxy**\n*Você pode tanto usar ou doar esse codigo para alguem!*\nUse o comando: **/resgatar [premium] (codigo)** para resgatar o premium`, embeds: [codigo_pronto]})
  }
}