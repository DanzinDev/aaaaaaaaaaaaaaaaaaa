const Discord = require('discord.js');
const setMembros = new Set();
var admin = require("firebase-admin");
let database = admin.database();

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setLabel('StarCoins')
        .setEmoji("851563806315905024")
        .setCustomId('1'),
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setLabel('Reputações')
        .setEmoji("855889289334226996")
        .setCustomId('2'),
        new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setLabel('Cookies')
        .setEmoji("945067105257144340")
        .setCustomId('5'),
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setLabel('Levels')
        .setEmoji("945069302652993586")
        .setCustomId('3'),
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setLabel('Convites')
        .setEmoji("945070485648072704")
        .setCustomId('4')
    ]
  )
module.exports = {
  name: 'placares',
  description: '[Social] - Todos os placares em 1 comando',
  run: async (client, interaction, guild) => {
    let embed = new Discord.MessageEmbed()
      .setTitle(`<:placar:945069309233889310> Escolha qual placar você deseja acessar`)
      .setColor("YELLOW")

    const reply = await interaction.reply({
      embeds: [embed],
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {
      switch (i.customId) {

        case '1':

          var moneyArray = []
          var finalArray = []
          var users = await database.ref(`user`).once('value')
          users = users.val()

          client.users.cache.map(async (user) => {
            if (users[user.id] && users[user.id].economy) moneyArray.push({ name: user.tag, money: users[user.id].economy.money || 0 })
          })
          moneyArray.sort(function(x, y) {
            if (x.money < y.money) return 1;
            if (x.money > y.money) return -1;
            return 0;
          });
          for (let user of moneyArray) {
            if (finalArray.length < 10) finalArray.push(`> **${finalArray.length + 1}**) ${user.name} | ${user.money} StarCoins`)
          }

          let embed1 = new Discord.MessageEmbed()
            .setTitle(`<:terra:944360671955533875> Placar Global`)
            .setDescription(`${finalArray.join("\n")}`)
            .setColor(`ORANGE`)

          i.update({ embeds: [embed1] });
          break;

        case '2':

          var reputationsArray = []
          var finalArray = []
          var users = await database.ref(`user`).once('value')
          users = users.val()

          client.users.cache.map(async (user) => {
            if (users[user.id] && users[user.id].social) reputationsArray.push({ name: user.tag, reputations: users[user.id].social.reputations || 0 })
          })
          reputationsArray.sort(function(x, y) {
            if (x.reputations < y.reputations) return 1;
            if (x.reputations > y.reputations) return -1;
            return 0;
          });
          for (let user of reputationsArray) {
            if (finalArray.length < 10) finalArray.push(`> **${finalArray.length + 1}**) ${user.name} | ${user.reputations} Reps`)
          }
          const embed2 = new Discord.MessageEmbed()
          .setTitle(`<:terra:944360671955533875> Placar Global`)
            .setDescription(`${finalArray.join("\n")}`)
            .setColor("ORANGE")
          i.update({ embeds: [embed2] });
          break;

        case '3':
          var levelArray = []
          var finalArray = []
          var users = await database.ref(`guild/${guild.id}/user/`).once('value')
          users = users.val()

          guild.members.cache.map(async (member) => {
            if (users[member.id] && users[member.id].levels) levelArray.push({ name: member.user.tag, level: users[member.id].levels.level || 0, xp: users[member.id].levels.xp })
          })
          levelArray.sort(function(x, y) {
            if (x.level < y.level) return 1;
            if (x.level > y.level) return -1;
            return 0;
          });
          for (let user of levelArray) {
            if (finalArray.length < 10) finalArray.push(`> **${finalArray.length + 1})** ${user.name} | Level: ${user.level}/${user.xp}`)
          }

          const embed3 = new Discord.MessageEmbed()
          .setTitle(`<:server:944362134450602055> Placar Local`)
            .setDescription(`${finalArray.join("\n")}`)
            .setColor("ORANGE")
          i.update({ embeds: [embed3] });
          break;

        case '4':
          const invites = await guild.invites.fetch();
          const topTen = invites.filter((inv) => inv.uses > 0).sort((a, b) => b.uses - a.uses).first(10);

          if (topTen.length === 0) return i.update("Atualmente não há convites neste servidor. Então convide mais pessoas! :)");

          let description = topTen.map((inv) => `> **${inv.inviter.tag}**: Convidou **${inv.uses.toLocaleString()}** Usuarios`)
          let embed4 = new Discord.MessageEmbed()
            .setColor("ORANGE")
            .setTitle(`<:server:944362134450602055> Placar Local`)
            .setDescription(description.slice(0, 10).join("\n"))
          i.update({ embeds: [embed4] });

          break;

          case '5':

          var cookiesArray = []
          var finalArray = []
          var users = await database.ref(`user`).once('value')
          users = users.val()

          client.users.cache.map(async (user) => {
            if (users[user.id] && users[user.id].minigames) cookiesArray.push({ name: user.tag, cookies: users[user.id].minigames.cookies || 0 })
          })
          cookiesArray.sort(function(x, y) {
            if (x.cookies < y.cookies) return 1;
            if (x.cookies > y.cookies) return -1;
            return 0;
          });
          for (let user of cookiesArray) {
            if (finalArray.length < 10) finalArray.push(`> **${finalArray.length + 1}**) ${user.name} | ${user.cookies} Cookies`)
          }
          const embed5 = new Discord.MessageEmbed()
          .setTitle(`<:terra:944360671955533875> Placar Global`)
            .setDescription(`${finalArray.join("\n")}`)
            .setColor("ORANGE")
          i.update({ embeds: [embed5] });
          break;
      }
    })
  }
}