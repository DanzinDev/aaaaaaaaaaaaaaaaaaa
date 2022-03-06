const Discord = require("discord.js");

let actionRow = new Discord.MessageActionRow()
  .addComponents(
    new Discord.MessageButton()
      .setCustomId('DADO')
      .setEmoji("🎲")
      .setStyle('PRIMARY')
  );

module.exports = {
  name: 'dado',
  description: '[Diversão] - Jogue o dado e teste sua sorte',
  options: [
    {
      name: "numero",
      description: "escolha um numero de 1 á 6",
      type: "NUMBER",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const numero = interaction.options.getNumber("numero");

    if (numero > 6 || numero <= 0) return interaction.reply(`**O numero tem que ser de 1 até 6**`)
    let jogue_o_dado = new Discord.MessageEmbed()
      .setTitle(`🎲 Jogue o dado`)
      .setDescription(`Você escolheu o numero: **${numero}**`)
      .setColor("RED")

    const reply = await interaction.reply({
      embeds: [jogue_o_dado],
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {
      let resultado = new Discord.MessageEmbed()
        .setDescription(`🎲 Sua escolha: ${numero}\n✅ Resultado: ${Math.floor(Math.random() * 6 + 1)}`)
        .setColor("RED")
      i.update({ embeds: [resultado], components: []})

    })
  }
}