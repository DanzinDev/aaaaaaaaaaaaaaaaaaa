const Discord = require("discord.js");

module.exports = {
  name: 'roleinfo',
  description: '[Discord] - Informações sobre algum cargo',
  options: [
    {
      name: "cargo",
      description: "escolha um cargo",
      type: "ROLE",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {

  const role = interaction.options.getRole("cargo"); 
		
		if (!role) return interaction.reply('*❌ Esse cargo é inválido*');

		const status = {
			false: 'Não é possivel mencionar...',
			true: 'Sim, pode ser mencionado por qualquer um!'
		};

		let roleembed = new Discord.MessageEmbed()
			.setColor(`${role.hexColor}`)
			.setThumbnail(guild.iconURL())
      .addField('**📄 Nome:**', role.name)
			.addField('**🆔 ID:**', `\`${role.id}\``)			
      .addField('**👥 Membros:**', `\`${role.members.size} membros\``)
			.addField('**:bell: Mencionavel:**', `\`${status[role.mentionable]}\``)
      .addField("**🖌️ Cor:**", `\`${role.hexColor}\``)

			.setTimestamp();

		interaction.reply({ embeds: [roleembed] });
	}
}