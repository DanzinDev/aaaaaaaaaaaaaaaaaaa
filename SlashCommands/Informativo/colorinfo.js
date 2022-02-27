const pop = require("popcat-wrapper");
const Discord = require("discord.js");
module.exports = {
  name: 'colorinfo',
  description: '[Informativo] - Mostrar informações de uma cor',
  options: [
    {
      name: "cor",
      description: "Diga um código de cor em HEX",
      type: "STRING",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const cor = interaction.options.getString("cor");

try {
const info = await pop.colorinfo(cor);
    const embed = new Discord.MessageEmbed()
     .addField(":art: Nome:", info.name, true)
     .addField("Hexadecimal:", "`" + info.hex + "`", true)
     .addField("RGB:", "`" + info.rgb + "`", true)
     .addField("Cor mais clara:", "`" + info.brightened + "`", true)
     .setImage(info.color_image)
     .setColor(info.hex);
    interaction.reply({ embeds: [embed] });
} catch (err) {
    interaction.reply(`**🎨 Forneça um código de cor HEX válido!**\n**Por exemplo:** *🟠 Laranja = FF5805*`);
   }    
}
}