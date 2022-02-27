const client = require('../../foxy.js');
const Discord = require("discord.js");
client.on("guildDelete", (guild) => {
    
  let canal = client.channels.cache.get("898401903145275414");
  
  let embed = new Discord.MessageEmbed()
    .setColor("RED")
    .setTitle(`ME REMOVERAM DO SERVIDOR`)
    .setDescription(`:heart: Servidor: \`${guild.name}\`\n:id: Id do servidor: \`${guild.id}\`\n:busts_in_silhouette: Membros: \`${guild.memberCount}\``)
    .setThumbnail(client.user.displayAvatarURL())
    .setTimestamp();
  canal.send({ embeds: [embed]}).catch(err => {return});
});