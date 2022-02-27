const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
const empregos = require('../../Utils/works.js').empregos
const empregoEmojis = require('../../Utils/works.js').emojis
const regMoney = require('../../Utils/regMoney.js')
const moment = require('moment-timezone');
moment.locale('pt-BR')
var gerarTexto = (money) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💼 Gastou ${money} StarCoins para pedir demissão**`
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
module.exports = {
  name: "demissão",
  description: "[Social] - Peça demissão do seu emprego",

  run: async (client, interaction, guild) => {
    let moneyDir = `user/${interaction.user.id}/economy/money`

    let empregoDir = `user/${interaction.user.id}/social/work`

    let preço = 3500
    let conta = await database.ref(moneyDir).once('value')
    conta = conta.val() || 0

    if (conta < preço) return interaction.reply(`Você não tem dinheiro sucifiente pra pedir demissão, você precisa de **${preço} StarCoins** nas mãos`)

    let emprego = await database.ref(empregoDir).once('value')

    emprego = emprego.val()

    if (!empregos[emprego]) return interaction.reply(`**Você não possui um emprego para pedir demissão**`)
    const reply = await interaction.reply({
      content: `Olá **${interaction.user.tag}**, Você realmente deseja deixar de ser ${empregos[emprego]}?\n:warning: Atenção: Você pagará **$${preço} StarCoins** pra pedir demissão!`,
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {
      interaction.editReply({components: []})
      switch (i.customId) {
        case 'ACEITO':
          await database.ref(empregoDir).set(null)
          await database.ref(moneyDir).set(conta - preço)
          await regMoney(interaction.user, gerarTexto(preço))
          interaction.followUp(`**✅ Você pediu demissão com sucesso!**`);
          break;
        case 'NEGO':
          return interaction.followUp(`✅ Comando cancelado com sucesso`)
          break;
      }
    })
  }
}