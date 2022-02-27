const Discord = require("discord.js")
const settings = require("../../settings.json")
var admin = require("firebase-admin");
let database = admin.database();
module.exports = {
  name: "editmoney",
  aliases: [],
  run: async (client, message, args) => {

    if (!settings.adm_id.includes(message.author.id)) {
      return message.channel.send(`> Apenas meus desenvolvedores podem utilizar esse comando!`)
    }

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])



    let quantia = args[2]

    let embed = new Discord.MessageEmbed()
      .setTitle(`❓ Informação sobre o comando`)
      .setDescription(`*Adicionar ou remover starcoins em alguem*`)
      .addField(`:hammer: **Uso**`, `\`f!editmoney <add / remove> <@user> <quantia>\``)
      .setColor('RED')

    if (!member) return message.channel.send({ embeds: [embed]})

    let moneyDir = `user/${member.id}/economy/money`

    if (!quantia) return message.channel.send(`${message.author}\n**Escreva a quantia que deseja adicionar StarCoins!**`)

    if (isNaN(quantia)) return message.channel.send(`${message.author}\n**Isso não é um número!**`)

    if (quantia <= 0) return message.channel.send(`${message.author}\n**A quantia deve ser maior que zero!**`)

    let money = await database.ref(moneyDir).once('value')
    money = money.val() || 0

    if (args[0] == "add") {

      await database.ref(moneyDir).set(money + Number(quantia))

      return message.channel.send(`:white_check_mark: ${message.author.username} adicionou **${quantia} <:StarCoins:851563806315905024> StarCoins** na conta do usuário: ${member.user.username}!`);

    }

    if (args[0] == "remove") {

      await database.ref(moneyDir).set(money - Number(quantia))

      return message.channel.send(`:white_check_mark: ${message.author.username} removeu **${quantia} <:StarCoins:851563806315905024> StarCoins** na conta do usuário: ${member.user.username}!`);

    }
  }
}