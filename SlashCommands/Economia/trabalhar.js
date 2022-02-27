const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
const fs = require("fs")
const ms = require('../../Utils/parsems');
const moment = require('moment-timezone');
moment.locale('pt-BR')
const math = require('mathjs');
const empregos = require('../../Utils/works.js').empregos
const emojis = require('../../Utils/works.js').emojis
const trabalhando = require('../../Utils/works.js').trabalhando
const regMoney = require('../../Utils/regMoney.js')


var gerarTexto = (money) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💰 Ganhou ${money} StarCoins trabalhando**`
}

module.exports = {
  name: 'trabalhar',
  description: '[Economia] - Trabalhe e ganhe StarCoins',
  run: async (client, interaction, guild) => {

    let cooldownDir = `user/${interaction.user.id}/cooldown/work`
    let moneyDir = `user/${interaction.user.id}/economy/money`
    let empregoDir = `user/${interaction.user.id}/social/work`

    let cooldown = await database.ref(cooldownDir).once('value')
    let money = await database.ref(moneyDir).once('value');
    let emprego = await database.ref(empregoDir).once('value')

    cooldown = cooldown.val()
    money = money.val() || 0
    emprego = emprego.val()

    const actionRow = new Discord.MessageActionRow()
      .addComponents(
        [
          new Discord.MessageButton()
            .setStyle('SUCCESS')
            .setEmoji(emojis[emprego])
            .setLabel(`Emprego: ${empregos[emprego]}`)
            .setCustomId('EMPREGO')
        ]
      )

    if (!empregos[emprego]) return interaction.reply(`**💼 Você precisa de um emprego para trabalhar!**`)

    const reply = await interaction.reply({
      content: `**💼 Clique no botão para trabalhar**`,
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {
      if (i.customId == "EMPREGO") {
        let timeout = 7200000;

        var valor = Math.floor(Math.random() * 450) + 870
        var resultado = math.evaluate(2 * valor)

        if (resultado == 0) resultado = resultado + valor

        if (cooldown == null) {

          await database.ref(moneyDir).set(money + 1500)

          await database.ref(cooldownDir).set(Date.now())

          await regMoney(interaction.user, gerarTexto(1500))

          return i.update({ content: `**${trabalhando(emprego)}\nMas como é seu primeiro dia de trabalho, você ganhou 1500 StarCoins**`, components: [] })

        }
        if (timeout - (Date.now() - cooldown) < 0) {
          let premium = await database.ref(`user/${interaction.member.id}/social/premium`).once('value')
          premium = premium.val()

          await database.ref(cooldownDir).set(Date.now())

          if (premium) {
            await database.ref(moneyDir).set(money + resultado)
            await regMoney(interaction.user, gerarTexto(resultado))

            return i.update({ content: `**${empregos[emprego]}: ${trabalhando(emprego)} e você recebeu ${valor} StarCoins\n👑 Mas, como você tem premium! Você ganhou o dobro de StarCoins\n:dollar: Foram adicionado ${valor * 2} StarCoins no seu saldo**`, components: [] })

          } else {

            await database.ref(moneyDir).set(money + valor);
            await regMoney(interaction.user, gerarTexto(valor))

            return i.update({ content: `**${empregos[emprego]}: ${trabalhando(emprego)} e você recebeu ${valor} StarCoins\n:dollar: Foram adicionado ${valor} StarCoins no seu saldo**`, components: [] })
          }
        }
        let time = ms(timeout - (Date.now() - cooldown));
        return i.update({ content: `**🚫 Você já trabalhou hoje!\nVolte em: ${time.hours} hora(s), ${time.minutes} minutos, e ${time.seconds} segundos.**`, components: [] })
      }
    })
  }
}