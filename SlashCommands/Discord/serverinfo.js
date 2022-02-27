const Discord = require("discord.js");
const moment = require("moment");
moment.locale('pt-BR')
module.exports = {
  name: "serverinfo",
  description: "[Discord] - Informações desse servidor",
  run: async (client, interaction, guild) => {

    const embed = new Discord.MessageEmbed()
            .setColor('ORANGE')

           .addField('📜 Nome do servidor:', `\`${guild.name}\``)

           .addField('🆔 Id do servidor:', `\`${guild.id}\``)

           .addField('📅 Criado em:', `\`${moment.utc(guild.createdAt).format("LL")}\``)

           .addField("👥 Usuários:", `💖 Pessoas: ${guild.members.cache.filter(member => !member.user.bot).size}\n🤖 Bots: ${guild.members.cache.filter(member => member.user.bot).size}`, true)

           .addField(`:rocket: Impulsos:`, `\`${guild.premiumSubscriptionCount} Impulsos\``)

           .addField(`✨ Nivel Booster:`,`\`${guild.premiumTier != "NONE" ? guild.premiumTier : 0} Boosters\``)

          .addField(`💬 Canais: ${guild.channels.cache.size} Canais`, `**🤠 Emojis:** ${guild.emojis.cache.size} Emojis\n**💼 Cargos:** ${guild.roles.cache.size} Cargos`, true)

         .setThumbnail(guild.iconURL())
         .setTimestamp()
         interaction.reply({ embeds: [embed]})
  }
}