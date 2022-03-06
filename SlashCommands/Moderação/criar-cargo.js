const Discord = require("discord.js");
const toHex = require("colornames");

module.exports = {
  name: 'criar-cargo',
  description: '[Moderação] - Irei criar um cargo',
  permission: 'MANAGE_ROLES',
  options: [
    {
      name: 'nome',
      description: 'Diga um nome para o cargo',
      type: 'STRING',
      required: true
    },
    {
      name: 'cor',
      description: 'Diga uma cor em hex para o cargo',
      type: 'STRING',
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const nome = interaction.options.getString('nome')
    const cor = interaction.options.getString('cor')

    if (!interaction.member.permissions.has('MANAGE_ROLES')) {
      return interaction.reply(`:x: Ei, você precisa ter permissão de **Gerenciar Cargos** para criar um cargo`)
    }
    if (nome.length > 100) {
      return interaction.reply("Your role can't be more than 100 characters long")
    }
    guild.roles.create({ name: nome, reason: "Creating new role", color: cor })
    let embed = new Discord.MessageEmbed()
      .setColor(cor)
      .setDescription(`
**📝 Nome do cargo:** ${nome}
**🎨 Cor do cargo:** ${cor}
**💬 Canal que foi feita a ação:** ${interaction.channel}
**👤 Cargo criado pelo(a):** ${interaction.member}
      `)
    interaction.reply({embeds: [embed] });
  }
}