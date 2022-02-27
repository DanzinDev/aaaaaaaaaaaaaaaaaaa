const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
  name: 'avatar',
  description: '[Discord] - Mostrar avatar do usuário',
  options: [
    {
      name: "user",
      description: "mencionar um usuário",
      type: "USER",
      required: false
    }
  ],
  run: async (client, interaction) => {

  const user = interaction.options.getUser("user");
  let member;
  if(user) member = interaction.guild.members.cache.get(user.id);
  else member = interaction.member;

  let embed = new MessageEmbed()
    .setColor(`ORANGE`)
    .setURL(member.user.displayAvatarURL({ dynamic: true }))
    .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }));

  interaction.reply({embeds : [embed]})
  }
};