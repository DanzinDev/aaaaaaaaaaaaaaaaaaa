const Discord = require('discord.js')
var admin = require("firebase-admin");
let database = admin.database();
const conversor = require("../../Utils/numbers");
const moment = require('moment-timezone');
moment.locale('pt-BR')
const regMoney = require('../../Utils/regMoney.js')

var gerarTextoStarCoinsEnviou = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💵 Deu ${money} StarCoins para \`${user.username} (Id: ${user.id})\`**`
}

var gerarTextoStarCoinsRecebeu = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💵 Recebeu ${money} StarCoins de \`${user.username} (Id: ${user.id})\`**`
}

var gerarTextoFoxypointEnviou = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💵 Deu ${money} foxypoint para \`${user.username} (Id: ${user.id})\`**`
}

var gerarTextoFoxypointRecebeu = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💵 Recebeu ${money} foxypoint de \`${user.username}\` (Id: ${user.id})\`**`
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
  name: 'pagar',
  description: '[Economia] - Dê StarCoins ou foxypoint para alguem',
  options: [
    {
      name: "starcoins",
      description: "Comprar foxypoints",
      type: 'SUB_COMMAND',
      options: [
        {
          name: "user",
          description: "Diga pra quem você deseja enviar StarCoins",
          type: "USER",
          required: true
        },
        {
          name: "quantia",
          description: "Diga quantos StarCoins você deseja dar para alguem",
          type: "NUMBER",
          required: true
        }
      ]
    },
    {
      name: "foxypoint",
      description: "Dê foxypoint para alguem",
      type: 'SUB_COMMAND',
      options: [
        {
          name: "user",
          description: "Diga pra quem você deseja enviar foxypoint",
          type: "USER",
          required: true
        },
        {
          name: "quantia",
          description: "Diga quantos foxypoints você deseja dar para alguem",
          type: "NUMBER",
          required: true
        }
      ]
    }

  ],
  run: async (client, interaction, guild, subCommand) => {
    let quantia = interaction.options.getNumber("quantia");
    let user = interaction.options.getUser("user");

    let moneyMDir = `user/${interaction.user.id}/economy/money`
    let moneyM = await database.ref(moneyMDir).once('value');
    moneyM = moneyM.val() || 0


    let moneyUDir = `user/${user.id}/economy/money`
    let moneyU = await database.ref(moneyUDir).once('value');
    moneyU = moneyU.val() || 0

    let pointsMDir = `user/${interaction.user.id}/economy/points`
    let pointsM = await database.ref(pointsMDir).once('value');
    pointsM = pointsM.val() || 0

    let pointsUDir = `user/${user.id}/economy/points`
    let pointsU = await database.ref(pointsUDir).once('value');
    pointsU = pointsU.val() || 0

    if (subCommand.name == "starcoins") {

      if (user.id == interaction.user.id) return interaction.reply(`\n**Como você quer enviar StarCoins para você mesmo? :thinking:**`);

      if (user.id == client.user.id) return interaction.reply(`**Você não pode enviar StarCoins para mim, eu já sou muito rico :fox::moneybag:**`);

      if (isNaN(quantia)) {
        return interaction.reply(`*Coloque um valor que seja maior que 0**`);
      };

      if (quantia <= 0) {
        return interaction.reply(`**Voce colocou um numero menor que 1**`);
      };

      if (moneyM < (quantia)) {
        let rest = parseInt(quantia) - moneyM;
        return interaction.reply(`**❌ Você não tem StarCoins suficiente para dar pra alguem\n💵 Você só tem: ${starcoins} ${conversor(moneyM)} StarCoins\n❗ Junte mais ${starcoins} ${conversor(rest)} StarCoins para comprar dar pra alguem**`)
      }

      const reply = await interaction.reply({
        content: `**⚠️ Você está prestes a mandar ${starcoins} ${conversor(quantia)} StarCoins para ${user.username}\n💵 Você ficará com ${starcoins} ${conversor(moneyM - (quantia))} StarCoins\n❓ É isso mesmo que você quer?**`,
        components: [actionRow],
        fetchReply: true
      })

      const filter = (b) => b.user.id === interaction.user.id
      const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
      collector.on('collect', async (i) => {
        if (i.customId == "ACEITO") {

          await database.ref(moneyUDir).set(Number(moneyU) + Number(quantia))

          await database.ref(moneyMDir).set(Number(moneyM) - Number(quantia))

          await regMoney(interaction.user, gerarTextoStarCoinsEnviou(quantia, user))

          await regMoney(user, gerarTextoStarCoinsRecebeu(quantia, interaction.user))

          interaction.editReply({ content: `**Você mandou **${quantia} Starcoins** para ${user.username} com sucesso!**`, components: [] })

        } else {
          return interaction.editReply({ content: `**✅ Pagamento cancelado com sucesso!**`, components: [] })
        }
      })
    }
    if (subCommand.name == "foxypoint") {

      if (user.id == interaction.user.id) return interaction.reply(`**Como você quer enviar foxypoints para você mesmo? :thinking:**`);

      if (user.id == client.user.id) return interaction.reply(`**Você não pode enviar foxypoints para mim, eu já sou muito rico :fox::moneybag:**`);

      if (isNaN(quantia)) {
        return interaction.reply(`**Coloque um valor que seja maior que 0**`);
      };

      if (quantia <= 0) {
        return interaction.reply(`**Voce colocou um numero menor que 1**`);
      };

      if (pointsM < quantia) {
        let rest = parseInt(quantia) - pointsM;

        return interaction.reply(`**:no_entry_sign: Você não pode realizar o pagamento!**\nPor que você não tem **${quantia} foxypoints em suas mãos**\n:moneybag: Junte **${rest} foxypoints** para fazer um pagamento desse valor (${quantia})`);
      };

      const reply = await interaction.reply({
        content: `**⚠️ Você está prestes a mandar ${foxypoint} ${conversor(quantia)} para ${user.username}\n💵 Você ficará com ${foxypoint} ${conversor(pointsM - (quantia))} StarCoins\n❓ É isso mesmo que você quer?**`,
        components: [actionRow],
        fetchReply: true
      })

      const filter = (b) => b.user.id === interaction.user.id
      const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
      collector.on('collect', async (i) => {
        if (i.customId == "ACEITO") {

          await database.ref(pointsUDir).set(Number(pointsU) + Number(quantia))

          await database.ref(pointsMDir).set(Number(pointsM) - Number(quantia))
          
          await regMoney(interaction.user, gerarTextoFoxypointEnviou(quantia, user))

          await regMoney(user, gerarTextoFoxypointRecebeu(quantia, interaction.user))

          interaction.editReply({ content: `**Você mandou **${quantia} foxypoint** para ${user.username} com sucesso!**`, components: [] })

        } else {
          return interaction.editReply({ content: `**✅ Pagamento cancelado com sucesso!**`, components: [] })
        }
      })
    }
  }
}