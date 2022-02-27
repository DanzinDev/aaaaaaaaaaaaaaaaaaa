const Discord = require('discord.js');
var admin = require("firebase-admin");
let database = admin.database();
const conversor = require("../../Utils/numbers");
module.exports = {
  name: 'resgatar',
  description: '[Social] - Resgate premios usando os codigos',
  options: [
    {
      name: "starcode",
      description: "Resgatar StarCoins",
      type: 'SUB_COMMAND',
      options: [
        {
          name: "codigo",
          description: "Insira o codigo para resgatar StarCoins",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "premium",
      description: "Resgatar o premium",
      type: 'SUB_COMMAND',
      options: [
        {
          name: "codigo",
          description: "Insira o codigo para resgatar o premium",
          type: "STRING",
          required: true
        }
      ]
    },
  ],
  run: async (client, interaction, guild, subCommand) => {
    let codigo = interaction.options.getString("codigo");
    let keysDir = `bot/keys`
    let premiumDir = `user/${interaction.user.id}/social/premium`
    let promocodeDir = `bot/promocodes`
    let moneyDir = `user/${interaction.user.id}/economy/money`

    let money = await database.ref(moneyDir).once('value')
    money = money.val() || 0
    interaction.deferReply()
    interaction.deleteReply()
    if (subCommand.name == "starcode") {

      let nameB = await database.ref(promocodeDir + "/" + codigo).once('value')
      nameB = nameB.val()
      let error = new Discord.MessageEmbed()
        .setDescription(`🚫 **Esse Starcode não existe!**\n**Starcode:**\n\`\`\`${codigo}\`\`\``)
        .setColor(`RED`)
      if (!nameB) return interaction.channel.send({ embeds: [error] })

      if (!nameB[2]) return interaction.channel.send(`**:no_entry_sign: Esse Starcode já existiu, mas não existe mais!**`)

      let error3 = new Discord.MessageEmbed()
        .setDescription(`🚫 **Você já usou esse Starcode!**`)
        .setColor(`RED`)
      if (nameB[1].includes(interaction.user.id)) return interaction.channel.send({ embeds: [error3] })

      nameB[1].push(interaction.user.id)
      await database.ref(moneyDir).set(money + nameB[0]);
      await database.ref(promocodeDir + "/" + codigo).set([nameB[0], nameB[1], nameB[2]]);

      let sucesso = new Discord.MessageEmbed()
        .setTitle(`✅ SUCESSO`)
        .setColor(`GREEN`)
        .setDescription(`🥳 Parabéns, você resgatou o Starcode e você recebeu ${conversor(nameB[0])} <:StarCoins:851563806315905024> StarCoins`)
      interaction.channel.send({ embeds: [sucesso] })
    }
    if (subCommand.name == "premium") {

      let nameB = await database.ref(keysDir + "/" + codigo).once('value')
      nameB = nameB.val()

      let error = new Discord.MessageEmbed()
        .setDescription(`🚫 **Esse codigo não existe!**\n**Codigo:**\n\`\`\`${codigo}\`\`\``)
        .setColor(`RED`)
      if (!nameB) return interaction.channel.send({ embeds: [error] })

      let premium = await database.ref(premiumDir).once('value')
      premium = premium.val()
      let jatempremium = new Discord.MessageEmbed()
        .setDescription(`**👑 Você já tem premium!**`)
        .setColor(`YELLOW`)
      if (premium) return interaction.channel.send({ embeds: [jatempremium] })

      await database.ref(premiumDir).set(true);
      await database.ref(keysDir + "/" + codigo).set(null);

      let sucesso = new Discord.MessageEmbed()
        .setTitle(`✅ SUCESSO`)
        .setColor(`GREEN`)
        .setDescription(`🥳 Parabéns, você resgatou o codigo e agora você tem premium:\n**Esse codigo não pode ser mais usado:**\n\`\`\`${codigo}\`\`\``)
      return interaction.channel.send({ embeds: [sucesso] })
    }
  }
}