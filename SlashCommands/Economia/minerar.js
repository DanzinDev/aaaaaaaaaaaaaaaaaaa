var admin = require("firebase-admin");
const chests = require('../../Utils/chests.json');
let database = admin.database();
const ms = require('../../Utils/parsems');
const moment = require('moment-timezone');
moment.locale('pt-BR')
const Discord = require("discord.js");
const math = require('mathjs');
const regMoney = require('../../Utils/regMoney.js')

var gerarTexto = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **⛏️ Minerou e conseguiu ${money} StarCoins**`
}

const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('851563044140351535')
        .setCustomId('MINERAR')
    ]
  )

module.exports = {
  name: 'minerar',
  description: '[Economia] - Minere e ganhe StarCoins encontrando recompensas',

  run: async (client, interaction, guild, subCommand) => {

    let cooldownDir = `user/${interaction.user.id}/cooldown/mining`
    let moneyDir = `user/${interaction.user.id}/economy/money`
    let picaretaDir = `user/${interaction.user.id}/itens/picareta`

    let cooldown = await database.ref(cooldownDir).once('value')
    cooldown = cooldown.val()
    let money = await database.ref(moneyDir).once('value');
    money = money.val() || 0
    let picareta = await database.ref(picaretaDir).once('value')
    picareta = picareta.val() || 0

    let timeout = 3600000;

    const fishID = Math.floor(Math.random() * 10) + 1;
    let rarity;
    if (fishID < 5) rarity = 'Commun';
    else if (fishID < 8) rarity = 'Incommun';
    else if (fishID < 9) rarity = 'Raro';
    else rarity = 'Lendario';
    const fishh = chests[rarity];
    const worth = randomRange(fishh.min, fishh.max);

    if (picareta < 1) return interaction.reply(`**Você não tem nenhuma <:picareta:851563044140351535> Picareta\nUse o comando: /foxyshop itens e compre**`)

    if (cooldown !== null && timeout - (Date.now() - cooldown) > 0) {
      let time = ms(timeout - (Date.now() - cooldown));

      interaction.reply(`<:picareta:851563044140351535> **Você já minerou!**\n**Você daqui á: ${time.hours}h ${time.minutes}m ${time.seconds}s**`)

    } else {
      database.ref(cooldownDir).set(Date.now())

      const reply = await interaction.reply({
        content: `**Use sua picareta <:picareta:851563044140351535> para minerar**`,
        components: [actionRow],
        fetchReply: true
      })

      const filter = (b) => b.user.id === interaction.user.id
      const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
      collector.on('collect', async (i) => {
        if (i.customId == "MINERAR") {
          let porcentagem = Math.floor(Math.random() * 100)
          if (porcentagem < 50) {
            return i.update({ content: `**😮‍💨 Ih ala, você estava minerando e não encontrou nada\nTente novamente daqui á 1 hora**`, components: [] })


          } else {


            await database.ref(moneyDir).set(money + worth);
            await database.ref(picaretaDir).set(picareta - 1)
await regMoney(interaction.user, gerarTexto(worth))    
            return i.update({ content: `<:picareta:851563044140351535> **Você estava minerando e achou uma ${fishh.symbol}**\n**Dentro dele tinha... ${worth} <:StarCoins:851563806315905024> StarCoins**`, components: [] })
          }
        }
      })
    }
  }
}