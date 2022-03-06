const Discord = require("discord.js");
module.exports = {
  name: 'expulsar',
  description: '[Moderação] - expulsar usuarios desobedientes',
  permission: 'KICK_MEMBERS',
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

if (!guild.me.permissions.has('KICK_MEMBERS')) {
            return interaction.reply(`:x: Eu preciso ter permissão de **expulsar membros** para expulsar alguem do servidor`)
        }
        if (!interaction.member.permissions.has('KICK_MEMBERS')) {
            return interaction.reply(`:x: Você precisa ter permissão de **expulsar membros** para expulsar alguem do servidor`)
        }

if (user.id === client.user.id) return interaction.reply("**Eu não posso me expulsar**")

if (!user.banable) return interaction.reply("Eu não posso expulsar usuarios superiores a mim, tente me colocar em um cargo superior")

if (user.id === guild.ownerId)
       return message.channel.send("Você não pode expulsar o dono do servidor")

if (interaction.user.id === user.id) 
       return interaction.reply("Porque você esta tentando se expulsar?")

let sucesso = new Discord.MessageEmbed()
       .addField(`Expulsado por:`, interaction.user)
       .addField(`Motivo:`, motivo)
       .setColor(`GREEN`)
       await guild.members.kick(user.id, motivo);
    interaction.reply({ embeds: [sucesso] })
  }
}