const Discord = require("discord.js");
module.exports = {
  name: 'banir',
  description: '[Moderação] - Banir usuarios desobedientes',
  permission: 'BAN_MEMBERS',
  options: [
    {
      name: "user",
      description: "Mencione um usuario",
      type: "USER",
      required: true
    },
    {
      name: "motivo",
      description: "Coloque um motivo",
      type: "STRING",
      required: true
    }
  ],

  run: async (client, interaction, guild) => {
const user = interaction.options.getUser("user");
    const motivo = interaction.options.getString("motivo");

if (!guild.me.permissions.has('BAN_MEMBERS')) {
            return interaction.reply(`:x: Eu preciso ter permissão de **banir membros** para banir alguem do servidor`)
        }
        if (!interaction.member.permissions.has('BAN_MEMBERS')) {
            return interaction.reply(`:x: Você precisa ter permissão de **banir membros** para banir alguem do servidor`)
        }

if (user.id === client.user.id) return interaction.reply("**Eu não posso me banir**")

if (user.id === guild.ownerId)
       return interaction.reply("Você não pode banir o dono do servidor")

if (interaction.user.id === user.id) 
       return interaction.reply("Porque você esta tentando se banir?")

let sucesso = new Discord.MessageEmbed()
       .addField(`Banido por:`, interaction.user)
       .addField(`Motivo:`, motivo)
       .setColor(`GREEN`)
       await guild.members.ban(user.id, motivo);
    interaction.reply({ embeds: [sucesso] })
  }
}