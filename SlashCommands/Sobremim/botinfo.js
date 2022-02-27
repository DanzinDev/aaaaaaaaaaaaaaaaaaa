const Discord = require("discord.js");
const ms = require('../../Utils/parsems');
const admin = require("firebase-admin");
const database = admin.database();

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [      
      new Discord.MessageButton()
        .setLabel("Suporte")
        .setStyle("LINK")
        .setEmoji('✉️')
        .setURL(`https://discord.gg/wpG7KjcUUh`),
      new Discord.MessageButton()
        .setLabel("Me convide")
        .setStyle("LINK")
        .setEmoji('🧡')
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=785945276389130254&permissions=8&redirect_uri=https%3A%2F%2Fwebfoxy.repl.co%2Fthanks&response_type=code&scope=identify%20guilds%20bot%20applications.commands`),
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('👑')
        .setLabel('Info premium')
        .setCustomId('PREMIUM'),
        new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('❓')
        .setLabel('Duvidas sobremim')
        .setCustomId('DUVIDAS'),
        new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('🏠')
        .setLabel('Voltar para o inicio')
        .setCustomId('INICIO')
    ]
  )
module.exports = {
  name: 'botinfo',
  description: '[Sobremim] - Minhas informações',
  run: async (client, interaction, guild) => {
    let embed0 = new Discord.MessageEmbed()
      .setDescription(`Carregando informações...`)
      .setColor('ORANGE');
    let msg = await client.channels.cache.get("887432673478467594").send({ embeds: [embed0] })
    let latencia = msg.createdTimestamp - interaction.createdTimestamp + `ms`
    msg.delete()

    let ping = Math.round(client.ws.ping) + `ms`


    let uptime = ms(client.uptime)

    let uptimeS = `${uptime.days} dias, ${uptime.hours} horas, ${uptime.minutes} minutos, ${uptime.seconds} segundos`

    let servers = client.guilds.cache.size
    let members = client.users.cache.size
    let embed = new Discord.MessageEmbed()
      .setTitle(`🦊 Minhas informações!`)
      .setDescription(
        `**🏓) Ping:     \`${ping}\`**\n` +
        `**📌) Latência: \`${latencia}\`**\n` +
        `**⌚) Uptime:   \`${uptimeS}\`**\n` +
        `**✨) Servidores:   \`${servers} servidores\`**\n` +
        `**👥) Pessoas:   \`${members} pessoas lindas\`**\n` +
        `**⏳) Memoria:   \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`**`)
      .setColor(`ORANGE`)
      .setThumbnail(client.user.displayAvatarURL())

    const reply = await interaction.reply({
      embeds: [embed],
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {
      switch (i.customId) {
        
        case 'PREMIUM':
          let premium = await database.ref(`user/${interaction.user.id}/social/premium`).once('value')
          premium = premium.val()
          premium = premium ? `😌 PREMIUM ATIVADO` : `:smiling_face_with_tear: NÃO POSSUI PREMIUM`
          let embed0 = new Discord.MessageEmbed()
            .setTitle(`👑 Informações sobre o premium`)
            .setDescription(`**${premium}**`)
            .addField(`❓ O que é premium?`, `O premium é um beneficio que lhe permite ganhar mais **StarCoins** e\nusar comandos somente para quem tem o premium`)

            .addField(`❓ Quais os beneficios de premium?`, `・Ganha o dobro de **StarCoins** nos comandos: **[/trabalhar e /daily]**\n・Poderá usar comandos apenas para premium\n・Poderá colocar +50 caracteres na descrição do perfil`)
            .setColor('ORANGE');
          i.update({ embeds: [embed0]});
          break;
          case 'DUVIDAS': 
          let embed1 = new Discord.MessageEmbed()
            .setTitle(`❓ Duvidas sobremim!`)

            .addField(`❓ O que posso ajudar?`, `Eu fui atualizado para a versão v13 do discord.js e estou com novos recursos para ajuda ainda mais no seu servidor :)`)

            .addField(`❓ Qual é minha comida favorita?`, `Obvio ne... **FRANGOOO** <:frangooooo:936870130678394910>`)

            .addField(`❓ Por que sou somente em comandos slash (comandos em barra /)?`, `Os meus desenvolvedores decidiram tirar o prefixo, mas pera, eles sabem o que estão fazendo e prometo que ainda sou legal <:foxy_descolado:933792083507036191>`)
            .setColor('ORANGE')
            .setImage(`https://media.discordapp.net/attachments/930885608279273522/932696661300502588/3_Sem_Titulo_20220117150212.png`)
          i.update({ embeds: [embed1]});

          break;

          case 'INICIO': 
          i.update({ embeds: [embed]});

          break;
      }
    })
  }
}