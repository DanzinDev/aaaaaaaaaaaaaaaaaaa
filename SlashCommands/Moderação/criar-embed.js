const Discord = require('discord.js')
module.exports = {
  name: 'criar-embed',
  description: '[Moderação] - Crie um embed',
permission: 'MANAGE_CHANNELS',
  options: [
    {
      name: "titulo",
      description: "Escreva algo",
      type: "STRING",
      required: true
    },
    {
      name: "mensagem",
      description: "Escreva algo",
      type: "STRING",
      required: false
    },
    {
      name: "cor",
      description: "Coloque uma com em hex",
      type: "STRING",
      required: false
    }
  ],

  run: async (client, interaction, guild) => {
    const titulo = interaction.options.getString('titulo')
    const mensagem = interaction.options.getString('mensagem')
    const cor = interaction.options.getString('cor')

    if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
      return interaction.reply(`:x: Ei, você precisa ter permissão de **Gerenciar Mensagens** para criar um embed`)
    }


    if (!titulo) {
      let embed = new Discord.MessageEmbed()
        .setColor(cor)
        .setDescription(mensagem)
        .setTimestamp()

      return interaction.reply({ embeds: [embed]})
    }

    
    if (!mensagem) {
      let embed = new Discord.MessageEmbed()
        .setColor(cor)
        .setTitle(titulo)
        .setTimestamp()

      return interaction.reply({ embeds: [embed]})
    }

    let embed = new Discord.MessageEmbed()
        .setColor(cor)
        .setTitle(titulo)
        .setDescription(mensagem)
        .setTimestamp()

    interaction.reply({ embeds: [embed]})
  }
}