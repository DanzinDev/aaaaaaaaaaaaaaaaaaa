const Discord = require("discord.js")
const settings = require("../../settings.json")
module.exports = {
  name: "serverlist",
  aliases: [],
  run: async (client, message, args) => {
if(!settings.adm_id.includes(message.author.id)) {
    return message.channel.send(`> Apenas meus desenvolvedores podem utilizar esse comando!`)
  }
  var servers = client.guilds
  var num = 0;
  var pagina = 1;
  var totalPages = parseInt(servers.cache.size / 10 + 1);

  var embed = new Discord.MessageEmbed()

    .setDescription(`${servers.cache.map(se => `Nome: \`${se.name}\`\n - ID: \`${se.id}\``).slice(0, 10).join('\n\n')}`)
    .setFooter(`Página ${pagina} de ${totalPages} (${client.guilds.cache.size} servidores encontrados.)`, message.author.displayAvatarURL())
    .setAuthor('Servidores que eu trabalho!', client.user.displayAvatarURL())
    .setColor('#36393e')
    .setThumbnail(client.user.displayAvatarURL())
  message.channel.send({ embeds: [embed] }).then(async ser => {

    if (servers.cache.size > 10) {

      await ser.react("⬅");
      await ser.react("➡");

      const voltar = ser.createReactionCollector((r, u) => r.emoji.name === "⬅" && u.id === message.author.id, { time: 100000 });
      const proximo = ser.createReactionCollector((r, u) => r.emoji.name === "➡" && u.id === message.author.id, { time: 100000 });

      voltar.on("collect", async r => {
        if (pagina !== 1) {
          num = num - 10
          num = num.toString().length > 1 ? num - parseInt(num.toString().slice(num.toString().length - 1)) : 0
          pagina -= 1
          var embed = new Discord.MessageEmbed()

            .addField(`Servidores:`, `${servers.cache.map(se => `Nome: \`${se.name}\`\n - ID: \`${se.id}\``).slice(pagina * 10 - 10, pagina * 10).join('\n\n')}`)
            .setFooter(`Página ${pagina} de ${totalPages} (${client.guilds.cache.size} servidores encontrados.)`, message.author.displayAvatarURL())
            .setColor('#36393e')
            .setAuthor('Servidores que eu trabalho!', client.user.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL())
          ser.edit({ embeds: [embed] })
          r.remove(r.users.last().id)
        } else {
          pagina = totalPages
          num = totalPages * 10 - 20

          var embedb = new Discord.MessageEmbed()

            .setDescription(`${servers.cache.map(se => `Nome: \`${se.name}\`\n - ID: \`${se.id}\``).slice(totalPages * 10 - 10, pagina * 10).join('\n\n')}`)
            .setFooter(`Página ${pagina} de ${totalPages} (${client.guilds.cache.size} servidores encontrados.)`, message.author.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL())
            .setAuthor('Servidores que eu trabalho!', client.user.displayAvatarURL())
            .setColor('#36393e')
          ser.edit({ embeds: [embedb] })

          r.remove(r.users.last().id)
        }
      })

      proximo.on("collect", async r => {
        if (pagina !== totalPages) {
          num = num.toString().length > 1 ? num - parseInt(num.toString().slice(num.toString().length - 1)) : 0
          num = num + 10
          pagina += 1

          var embedc = new Discord.MessageEmbed()

            .setDescription(`${servers.cache.map(se => `Nome: \`${se.name}\`\n - ID: \`${se.id}\``).slice(pagina * 10 - 10, pagina * 10).join('\n\n')}`)
            .setFooter(`Página ${pagina} de ${totalPages} (${client.guilds.cache.size} servidores encontrados.)`, message.author.displayAvatarURL())
            .setThumbnail(client.user.displayAvatarURL)
            .setAuthor('Servidores que eu trabalho!')
            .setColor('#36393e')
          ser.edit({ embeds: [embedc]} )

          r.remove(r.users.last().id)
        } else {
          pagina = 1
          num = 0

          var embedd = new Discord.MessageEmbed()

            .setDescription(`${servers.cache.map(se => `Nome: \`${se.name}\`\n - ID: \`${se.id}\``).slice(0, pagina * 10).join('\n\n')}`)
            .setFooter(`Página ${pagina} de ${totalPages} (${client.guilds.cache.size} servidores encontrados.)`, message.author.displayAvatarURL())
            .setAuthor('Servidores que eu trabalho!')
            .setColor('#36393e')
          ser.edit({ embeds: [embedd]})

          r.remove(r.users.last().id)
        }
      })
    }
  })
  }
}