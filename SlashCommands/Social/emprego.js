const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
const empregos = require('../../Utils/works.js').empregos

function gerarOptions() {
  let options = []

  for (var i = 0; i < empregos.length; i++) {
    options.push({ label: String(empregos[i]), value: String(i)})
  }
  
  return options
}

module.exports = {
  name: "emprego",
  description: "[Social] - Escolha um emprego",

  run: async (client, interaction, guild) => {
    let empregoDir = `user/${interaction.user.id}/social/work`

    let emprego = await database.ref(empregoDir).once('value')
    emprego = emprego.val()

    if (empregos[emprego]) return await interaction.reply({ content: `💼** Você já tem um emprego: ${empregos[emprego]}**`, ephemeral: true });

    const Principal = new Discord.MessageEmbed()
      .setTitle(`💼 Escolha um emprego`)
       .setDescription(`*São no total **(${empregos.length} empregos)** para você escolher*\n${empregos.join(`\n`)}`)
      .setColor("BLURPLE"); 
    
  
    const reply = await interaction.reply({
      embeds: [Principal],
      fetchReply: true,
      components: [
        new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageSelectMenu()
              .setCustomId("Nino")
              .setPlaceholder("Escolha um emprego")
              .addOptions(gerarOptions())
          )
      ]
    })
    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })    
    collector.on("collect", async (i) => { 
      
      interaction.editReply({components: []})

      if (empregos[i.values[0]]){
        await database.ref(empregoDir).set(String(i.values[0]))
        return interaction.followUp({ content: `**Você se tornou um ${empregos[i.values[0]]}**`})
      } else {
        return interaction.followUp({ content: `**Algo deu errado**` })
      }
    })
  }
}