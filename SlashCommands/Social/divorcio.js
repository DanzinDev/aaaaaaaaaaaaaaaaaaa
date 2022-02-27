const Discord = require("discord.js");
var admin = require("firebase-admin");
let database = admin.database();

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('SUCCESS')
        .setEmoji('💔')
        .setLabel('Quero Me Divorciar')
        .setCustomId('Divorcio'),
      new Discord.MessageButton()
        .setStyle('DANGER')
        .setEmoji('❌')
        .setLabel('Cancelar')
        .setCustomId('NEGO')
    ]
  )
module.exports = {
  name: "divorciar",
  description: "[Social] - Dê um tempo ao casamento",
  run: async (client, interaction, guild) => {
    let divorcio_author = `user/${interaction.user.id}/social/marry`    

    let authordata = await database.ref(divorcio_author).once('value')
    authordata = authordata.val()

    if (authordata == null) return interaction.reply(`**Você não está casado(a)!**`);

    const user = await client.users.cache.get(authordata)

    let divorcio_user = `user/${user.id}/social/marry`

    const reply = await interaction.reply({
      content: `${interaction.user}\n**Então é o fim?\n❓ Você quer realmente se divorciar de ${user.tag}?**`,
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (60000) })
    collector.on('collect', async (i) => {

      if (i.customId == "Divorcio") {

        i.update({ content: `${interaction.user}\n**Então é isso, acabou tudo 🥲**\n**Espero que você e o(a) ${user.tag} continuem sendo grandes amigos**`, components: [] })

        database.ref(divorcio_author).set(null)      

        database.ref(divorcio_user).set(null)

      } else {
        return i.update({ content: `${interaction.user}\n**😮‍💨 UFA\nPedido de divorcio cancelado com sucesso!**`, components: [] })
      }
    })
  }
}