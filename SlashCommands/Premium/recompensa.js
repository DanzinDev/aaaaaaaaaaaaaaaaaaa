let Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
const regMoney = require('../../Utils/regMoney.js')
const ms = require('../../Utils/parsems');
const moment = require('moment-timezone');
moment.locale('pt-BR')


var gerarTexto = (money) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **🎁 Coletou ${money} StarCoins da recompensa de premium**`
}

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('SUCCESS')
        .setEmoji(`🎁`)
        .setLabel(`Coletar`)
        .setCustomId('Coletar')
    ]
  )

module.exports = {
  name: 'recompensa',
  description: '[Premium] - Colete uma recompensa apenas para quem tem premium!',

  run: async (client, interaction, guild) => {
    let cooldownDir = `user/${interaction.user.id}/cooldown/claimpremium`

    let moneyDir = `user/${interaction.user.id}/economy/money`
    let cooldown = await database.ref(cooldownDir).once('value')
    cooldown = cooldown.val()

    let money = await database.ref(moneyDir).once('value');
    money = money.val() || 0

    let premium = await database.ref(`user/${interaction.user.id}/social/premium`).once('value')
    premium = premium.val()
    if (!premium) {
      return interaction.reply(`👑 **Você não pode usar esse comando!**\n**Apenas pessoas que possui premium**`)
    }

    const reply = await interaction.reply({
      content: `**👑 Clique no botão para resgatar a recompensa**`,
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {
      if (i.customId == "Coletar") {
        let timeout = 18000000;

        let valor = Math.floor(Math.random() * 650) + 2500

        if (timeout - (Date.now() - cooldown) < 0) {
          await database.ref(moneyDir).set(money + valor);

          await database.ref(cooldownDir).set(Date.now())

          await regMoney(interaction.user, gerarTexto(valor))

          return i.update({ content: `**👑 Você coletou sua recompensa de premium**\n**${valor} <:StarCoins:851563806315905024> StarCoins foram adicionado ao seu banco**`, components: [] })
        }

        let time = ms(timeout - (Date.now() - cooldown));
        return i.update({ content: `**🚫 Você já coletou sua recompensa de premium hoje!\nVolte em: ${time.hours} hora(s), ${time.minutes} minutos, e ${time.seconds} segundos.**`, components: [] })
      }
    })
      }
}