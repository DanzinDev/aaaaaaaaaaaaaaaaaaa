const admin = require("firebase-admin");
const database = admin.database();
const Discord = require('discord.js');

const metas = [
  10,
  100,
  200,
  300,
  400,
  500,
  600,
  700,
  800,
  900,
  1000
]

const checarMeta = (cookies) => {
  let meta = null;
  let nextMeta;
  for (meta2 of metas) {

    if (cookies == meta2)
    {
      meta = meta2
      nextMeta = metas[metas.indexOf(meta2) + 1]
      break;
    }

  }

  return {meta, nextMeta};
}

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('SECONDARY')
        .setEmoji('🍪')
        .setCustomId('COOKIE'),
        new Discord.MessageButton()
        .setStyle('SECONDARY')
        .setEmoji('❓')
        .setCustomId('AJUDA')
    ]
  )
module.exports = {
  name: 'cookie',
  description: '[Minigames] - Clique no cookie e farme pontos',
  run: async (client, interaction, guild) => {
    let cookiesDir = `user/${interaction.user.id}/minigames/cookies`

    let cookies = await database.ref(cookiesDir).once('value')
    cookies = cookies.val() || 0

    let embedCookies = new Discord.MessageEmbed()
      .setTitle('🍪 Cookie Clicker')
      .setDescription(`Sua pontuação: ${cookies}\n\n• Clique no botão com o emoji **(🍪)** para começar\n• Clique no botão com o emoji **(❓)** para saber como funciona o comando`)
      .setColor('#a86f32')

    const reply = await interaction.reply({
      embeds: [embedCookies],
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })

    collector.on('collect', async (i) => {
      switch (i.customId) {
        case 'COOKIE':
          cookies++
          let meta = checarMeta(cookies)
          let embedCookies1 = new Discord.MessageEmbed()
            .setTitle('🍪 Cookie Clicker')
            .setDescription(`Pontuação: ${cookies}`)
            .setColor('#a86f32')
          if (meta.meta)
          {
            embedCookies1.setDescription(`Pontuação: ${cookies}\n\nParabéns! Você chegou na meta de ${meta.meta}\nSua proxima meta é: ${meta.nextMeta}`)
          }

          i.update({ embeds: [embedCookies1], components: [actionRow] })

          if (cookies % 5 == 0) {
            await database.ref(cookiesDir).set(cookies)
          }
          //
          break;

        case 'AJUDA':
          let embedAjuda = new Discord.MessageEmbed()
            .setTitle('❓ Como jogar!')
            .setDescription(`O comando foi inspirado no jogo: **[Cookie Clicker](https://orteil.dashnet.org/cookieclicker/)**\nO objetivo do jogo é apenas ficar clicando no cookie e conseguindo pontos\n\nAqui no comando o **Cookie** que você tem que clicar é o botão com esse emoji **(🍪)**, cada clique no botão é **1 ponto** e você pode ficar farmando pontos para entrar no **Placar De Cookies** <:cookies:945067105257144340>`)
            .setColor('RED')
          i.update({ embeds: [embedAjuda], components: [actionRow] })
          break;
      }
    })

  }
}