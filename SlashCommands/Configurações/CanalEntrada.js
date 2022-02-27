const Discord = require("discord.js");
var admin = require("firebase-admin");
let database = admin.database();
module.exports = {
  name: 'setentrada',
  description: '[Configurações] - Setar um canal de boas vindas',
  options: [
    {
      name: "canal",
      description: "Coloque um canal",
      type: "CHANNEL",
      channelTypes: ['GUILD_TEXT'],
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const canal = interaction.options.getChannel("canal");
    let channelDir = `guild/${guild.id}/settings/welcome/channel`

    if (!interaction.member.permissions.has("MANAGE_CHANNELS")) {
            return interaction.reply(`:x: Você precisa ter permissão de **gerenciar canais** para usar esse comando`)
        }

  interaction.reply(`✅ Canal de boas vindas setado com sucesso`)
  database.ref(channelDir).set(canal.id)

} 
}