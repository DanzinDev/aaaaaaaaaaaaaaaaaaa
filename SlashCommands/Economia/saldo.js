const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
const conversor = require("../../Utils/numbers");

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('⬅️')
        .setCustomId('VOLTAR'),
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('➡️')
        .setCustomId('PASSAR')
    ]
  )
let emojiStarCoins = `<:StarCoins:851563806315905024>`
let emojiFoxyPoint = `<:FoxyPoint:915987107082809374>`
module.exports = {
  name: 'saldo',
  description: '[Economia] - Veja sua conta bancaria de StarCoins',
  options: [
    {
      name: "user",
      description: "mencionar um usuário",
      type: "USER",
      required: false
    }
  ],
  run: async (client, interaction, guild) => {
    const user = interaction.options.getUser("user");
    let member;
    if (user) member = interaction.guild.members.cache.get(user.id);
    else member = interaction.member;

    let moneyDir = `user/${member.id}/economy/money`

    let bankDir = `user/${member.id}/economy/bank`

    let pointsDir = `user/${member.id}/economy/points`

    let money = await database.ref(moneyDir).once('value')
    money = money.val() || 0

    let points = await database.ref(pointsDir).once('value')
    points = points.val() || 0

    let bank = await database.ref(bankDir).once('value')
    bank = bank.val() || 0

    let embed = new Discord.MessageEmbed()
      .addField(`**${emojiStarCoins}) StarCoins:**`, `\`${conversor(money)} StarCoin(s)\``)
      .addField(`**${emojiFoxyPoint}) FoxyPoints:**`, `\`${conversor(points)} Foxypoint(s)\``)
      .addField(`**🏦) Banco:**`, `\`${conversor(bank)} StarCoin(s)\``)
      .setColor(`ORANGE`)
      .setThumbnail(member.displayAvatarURL())

    const reply = await interaction.reply({
      embeds: [embed],
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {
      if (i.customId == "PASSAR") {
        let embed = new Discord.MessageEmbed()
          .addField(`**${emojiStarCoins}) StarCoins:**`, `\`${money} StarCoin(s)\``)
          .addField(`**${emojiFoxyPoint}) FoxyPoints:**`, `\`${points} Foxypoint(s)\``)
          .addField(`**🏦) Banco:**`, `\`${bank} StarCoin(s)\``)
          .setColor(`ORANGE`)
          .setThumbnail(member.displayAvatarURL())


        return i.update({ embeds: [embed] })
      }
      if (i.customId == "VOLTAR") {
        let embed = new Discord.MessageEmbed()
          .addField(`**${emojiStarCoins}) StarCoins:**`, `\`${conversor(money)} StarCoin(s)\``)
          .addField(`**${emojiFoxyPoint}) FoxyPoints:**`, `\`${conversor(points)} Foxypoint(s)\``)
          .addField(`**🏦) Banco:**`, `\`${conversor(bank)} StarCoin(s)\``)
          .setColor(`ORANGE`)
          .setThumbnail(member.displayAvatarURL())
        return i.update({ embeds: [embed] })
      }
    })
  }
}