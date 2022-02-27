const Discord = require('discord.js')
var admin = require("firebase-admin");
let database = admin.database();
const conversor = require("../../Utils/numbers");
const moment = require('moment-timezone');
moment.locale('pt-BR')
const regMoney = require('../../Utils/regMoney.js')

var gerarTextoTroca = (money) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **🔄 Trocou ${money} StarCoins por foxypoints**`
}

var gerarTextoConverter = (money) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **🔄 Converteu ${money} foxypoint para StarCoins**`
}

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('SUCCESS')
        .setEmoji('✅')
        .setLabel('Sim')
        .setCustomId('ACEITO'),
      new Discord.MessageButton()
        .setStyle('DANGER')
        .setEmoji('❌')
        .setLabel('Não')
        .setCustomId('NEGO')
    ]
  )

let starcoins = '<:StarCoins:851563806315905024>'
let foxypoint = '<:FoxyPoint:915987107082809374>'
module.exports = {
  name: 'foxypoints',
  description: '[Economia] - Troque seus StarCoins por foxypoints',
  options: [
    {
      name: "comprar",
      description: "Comprar foxypoints",
      type: 'SUB_COMMAND',
      options: [
        {
          name: "quantia",
          description: "Diga quantos foxypoints você deseja comprar",
          type: "NUMBER",
          required: true
        }
      ]
    },
    {
      name: "info",
      description: "Informações sobre foxypoints",
      type: 'SUB_COMMAND'
    },
    {
      name: "converter",
      description: "Transforme seus foxypoints em StarCoins novamente",
      type: 'SUB_COMMAND',
      options: [
        {
          name: "quantia",
          description: "Diga quantos foxypoints você deseja converter para StarCoins",
          type: "NUMBER",
          required: true
        }
      ]
    }

  ],
  run: async (client, interaction, guild, subCommand) => {
    let quantia = interaction.options.getNumber("quantia");

    let pointsDir = `user/${interaction.user.id}/economy/points`
      let points = await database.ref(pointsDir).once('value');
      points = points.val() || 0

      let moneyDir = `user/${interaction.user.id}/economy/money`
      let money = await database.ref(moneyDir).once('value');
      money = money.val() || 0

    if (subCommand.name == "comprar") {          

      if (money < (10000 * quantia)) {
        let rest = parseInt(10000 * quantia) - money;
        return interaction.reply(`**❌ Você não tem StarCoins suficiente para comprar ${foxypoint} ${conversor(quantia)} foxypoint\n💵 Você só tem: ${starcoins} ${conversor(money)} StarCoins\n❗ Junte mais ${starcoins} ${conversor(rest)} StarCoins para comprar ${foxypoint} ${conversor(quantia)} foxypoint**`)
      }

      const reply = await interaction.reply({
        content: `**⚠️ Você está prestes a trocar ${starcoins} ${conversor(10000 * quantia)} StarCoins por ${foxypoint} ${conversor(quantia)} foxypoint\n❓ É isso mesmo que você quer?\n💵 Você ficará com ${starcoins} ${conversor(money - (10000 * quantia))} StarCoins**`,
        components: [actionRow],
        fetchReply: true
      })

      const filter = (b) => b.user.id === interaction.user.id
      const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
      collector.on('collect', async (i) => {
        if (i.customId == "ACEITO") {

          await database.ref(pointsDir).set(points + quantia)
          await database.ref(moneyDir).set(money - (10000 * quantia))
          
          await regMoney(interaction.user, gerarTextoTroca(10000 * quantia))

          interaction.editReply({ content: `**✅ Você trocou ${starcoins} ${conversor(10000 * quantia)} StarCoins por ${foxypoint} ${conversor(quantia)} foxypoint com sucesso**`, components: [] })

        } else {
          return interaction.editReply({ content: `**✅ Compra cancelado com sucesso!**`, components: [] })
        }
      })
    }
    if (subCommand.name == "info") {
      let info = new Discord.MessageEmbed()
        .setTitle(`🔖 Informações sobre foxypoints`)
        .addField(`❓ O que é foxypoints?`, `*Os foxypoints são outro tipo de moeda que pode ser usar para comprar itens que irão te beneficiar bastante*`)
        .addField(`❓ Como ter foxypoints?`, `*Precisa ter 10,000 StarCoins e poderá trocar por 1 foxypoint, é só usar o comando \`/foxypoints comprar [quantidade]\`*`)

        .setThumbnail(`https://cdn.discordapp.com/emojis/915987107082809374.png`)
        .setColor(`ORANGE`)
      interaction.reply({ embeds: [info] })
    }
    if (subCommand.name == "converter") {

      if (points < (1 * quantia)) {
        let rest = parseInt(1 * quantia) - points;
        return interaction.reply(`**❌ Você não tem foxypoints suficiente para converter pra ${starcoins} ${conversor(5000 * quantia)} StarCoins\n💵 Você só tem: ${foxypoint} ${conversor(points)} foxypoint\n❗ Junte mais ${foxypoint} ${conversor(rest)} foxypoint para converter pra ${starcoins} ${conversor(5000 * quantia)} StarCoins**`)
      }

      const reply = await interaction.reply({
        content: `**⚠️ Você está prestes a converter ${foxypoint} ${conversor(quantia)} foxypoint para ${starcoins} ${conversor(5000 * quantia)} StarCoins\n💵 Você ficará com ${starcoins} ${conversor(money + (5000 * quantia))} StarCoins\n📄 Atenção: Cada foxypoint custou 10k de StarCoins, o preço para converter é 5k de cada foxypoint\n❓ É isso mesmo que você quer?**`,
        components: [actionRow],
        fetchReply: true
      })

      const filter = (b) => b.user.id === interaction.user.id
      const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
      collector.on('collect', async (i) => {
        if (i.customId == "ACEITO") {

          await database.ref(pointsDir).set(points - quantia)
          await database.ref(moneyDir).set(money + (5000 * quantia))
          await regMoney(interaction.user, gerarTextoConverter(quantia))

          interaction.editReply({ content: `**✅ Você converteu ${foxypoint} ${conversor(quantia)} foxypoint para ${starcoins} ${conversor(5000 * quantia)} StarCoins com sucesso**`, components: [] })

        } else {
          return interaction.editReply({ content: `**✅ Comando cancelado com sucesso!**`, components: [] })
        }
      })
    }
  }
}