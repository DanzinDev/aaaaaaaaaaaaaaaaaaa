const Discord = require("discord.js");
var admin = require("firebase-admin");
let database = admin.database();

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('SUCCESS')
        .setEmoji('💍')
        .setLabel('Aceito')
        .setCustomId('ACEITO'),
      new Discord.MessageButton()
        .setStyle('DANGER')
        .setEmoji('❌')
        .setLabel('Não')
        .setCustomId('NEGO')
    ]
  )
module.exports = {
  name: "casar",
  description: "[Social] - Mande um pedido de casamento para alguém",
  options: [
    {
      name: "user",
      description: "Mencione um user",
      type: "USER",
      required: true
    },
  ],
  run: async (client, interaction, guild) => {
    const mentioned = interaction.options.getUser('user')

    let casamento_author = `user/${interaction.user.id}/social/marry`

    let authordata = await database.ref(casamento_author).once('value')
    authordata = authordata.val()

    if (!mentioned) return message.reply(error)
    let casamento_user = `user/${mentioned.id}/social/marry`

    if (mentioned === client.user) return interaction.reply(`**Infelizmente não posso me casar com você**`)

    if (mentioned.id === interaction.user.id) return interaction.reply(`**Eu sei que você se ama**\n**Mas casar com você mesmo não dá**`)

    if (authordata && authordata !== 'null') return interaction.reply(`**💍 Você já está casado(a)!**`)

    let user2 = await database.ref(casamento_user).once('value')
    user2 = user2.val()

    if (user2 && user2 !== null) return interaction.reply(`**${mentioned.username}** Já está casado(a)`);

    const reply = await interaction.reply({
      content: `${mentioned}\n**💍 Você recebeu um pedido de casamento de ${interaction.user.tag}\n:timer: Você tem 1 minuto para aceitar o pedido!**`,
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === mentioned.id
    const collector = reply.createMessageComponentCollector({ filter, time: (60000) })
    collector.on('collect', async (i) => {

      if (i.customId == "ACEITO") {

        i.update({ content: `❤️ ${interaction.user} e ${mentioned}\n**💍 Vocês agora estão casados\n📜 Felicidades para vocês dois!**`, components: [] })

        database.ref(casamento_author).set(mentioned.id)

        database.ref(casamento_user).set(interaction.user.id)

      } else {
        return i.update({ content: `${interaction.user}\n**Me desculpe...\nMas seu pedido de casamento foi rejeitado** :pensive:`, components: [] })
      }
    })
  }
}