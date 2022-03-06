const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();

module.exports = {
  name: 'alertas',
  description: '[Moderação] - Ver quantos alertas você já recebeu',
  options: [
    {
      name: 'user',
      description: 'Mencione um usuario',
      type: 'USER',
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const user = interaction.options.getUser('user')

   let warningsDir = 
   `guild/${guild.id}/user/${user.id}/warnings`

    let warning = await database.ref(warningsDir).once('value')
    warning = warning.val() || 0

let alertas = new Discord.MessageEmbed()
.setTitle(`🚨 Alertas de ${user.tag}`)
.setDescription(`📋 Total de alertas: ${warning}`)
.setColor(`RED`)
.setThumbnail(user.displayAvatarURL())

interaction.reply({ embeds: [alertas] })
  }
}