var admin = require("firebase-admin");
const fishes = require('../../Utils/fishes.json');
let database = admin.database();
const ms = require('../../Utils/parsems');
const moment = require('moment-timezone');
moment.locale('pt-BR')
const Discord = require("discord.js");
const math = require('mathjs');
const regMoney = require('../../Utils/regMoney.js')

var gerarTexto = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **🎣 Pescou e conseguiu ${money} StarCoins**`
}

const randomRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('919286250953912421')
        .setCustomId('PESCAR')
    ]
  )

module.exports = {
  name: 'pescar',
  description: '[Economia] - Encontre peixes e ganhe StarCoins',

  run: async (client, interaction, guild, subCommand) => {

    let bal = await database.ref(`user/${interaction.user.id}/economy/money`).once('value');
    bal = bal.val() || 0

    let pescarDir = `user/${interaction.user.id}/itens/pescar`
    let pescar = await database.ref(pescarDir).once('value')
    pescar = pescar.val() || 0

    const fishID = Math.floor(Math.random() * 10) + 1;
    let rarity;
    if (fishID < 5) rarity = 'Lixo';
    else if (fishID < 8) rarity = 'Commun';
    else if (fishID < 9) rarity = 'Incommun';
    else if (fishID < 10) rarity = 'Raro';
    else rarity = 'Lendario';
    const fishh = fishes[rarity];
    const worth = randomRange(fishh.min, fishh.max);

    let timeout = 3600000;
    let fishtime = await database.ref(`user/${interaction.user.id}/cooldown/fishtime`).once('value');
    fishtime = fishtime.val()

    if (pescar < 1) return interaction.reply(`**Você não tem nenhuma <:vara_de_pescar:919286250953912421> Vara de pescar\nUse o comando: /foxyshop itens e compre**`)


    if (fishtime !== null && timeout - (Date.now() - fishtime) > 0) {
      let time = ms(timeout - (Date.now() - fishtime));

      return interaction.reply(`**<:vara_de_pescar:919286250953912421> Você já pescou!**\n**Volte daqui á: ${time.minutes}m ${time.seconds}s**`);
    }
    await database.ref(`user/${interaction.user.id}/cooldown/fishtime`).set(Date.now());
    await database.ref(pescarDir).set(pescar - 1)

const reply = await interaction.reply({
        content: `**Use sua vara de pescar <:vara_de_pescar:919286250953912421> para pescar**`,
        components: [actionRow],
        fetchReply: true
      })

      const filter = (b) => b.user.id === interaction.user.id
      const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
      collector.on('collect', async (i) => {
        if (i.customId == "PESCAR") {
await regMoney(interaction.user, gerarTexto(worth))


    i.update({ content: `🎣 **Você conseguiu um ${fishh.symbol}**\n**Você vendeu e recebeu: ${worth}<:StarCoins:851563806315905024> StarCoins**!`, components: [] });

    database.ref(`user/${interaction.user.id}/economy/money`).set(bal + worth);
        }
      })
  }
}