const Discord = require("discord.js");
var admin = require("firebase-admin");
let database = admin.database();
module.exports = {
  name: 'mensagementrada',
  description: '[Configurações] - Crie uma mensagem de boas vindas',
  options: [
    {
      name: "titulo",
      description: "Coloque um canal",
      type: "STRING",
      required: true
    },
    {
      name: "mensagem",
      description: "Coloque um canal",
      type: "STRING",
      required: false
    }
  ],
  run: async (client, interaction, guild) => {
    const titulo = interaction.options.getString("titulo");
    const mensagem = interaction.options.getString("mensagem");

    let titleDir = `guild/${guild.id}/settings/welcome/title`
    let messageDir = `guild/${guild.id}/settings/welcome/message`

    if (!interaction.member.permissions.has("MANAGE_CHANNELS")) {
      return interaction.reply(`:x: Você precisa ter permissão de **gerenciar canais** para usar esse comando`)
    }

    if (!titulo) {
      database.ref(messageDir).set(String(`${mensagem}`))

      interaction.reply(`*<a:mensagem:852641393406771200> Mensagem de entrada foi setada com sucesso*`)
      return
    }
    if (!mensagem) {
      database.ref(titleDir).set(String(`${titulo}`))

      interaction.reply(`*<a:mensagem:852641393406771200> Titulo de entrada foi setada com sucesso*`)
      return
    }

    database.ref(messageDir).set(String(`${mensagem}`))

    database.ref(titleDir).set(String(`${titulo}`))

    interaction.reply(`*<a:mensagem:852641393406771200> Mensagem de entrada foi setada com sucesso*`)


  }
}