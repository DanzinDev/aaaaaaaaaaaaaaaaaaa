const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();

const getPage = (array, page) => {

  if (!array || page == null) return []

  let newPage = []

  let pageMin = Number(page)*10
  let pageMax = (Number(page) * 10) + 9

  for(; pageMin <= pageMax; pageMin++) {
    if (array[pageMin]) newPage.push(array[pageMin])
  }

  return newPage
  
}

const actionRow = new Discord.MessageActionRow().addComponents(
  [
    new Discord.MessageButton()
      .setStyle('PRIMARY')
      .setEmoji('⬅️')
      .setDisabled(true)
      .setCustomId('previous'),
    new Discord.MessageButton()
      .setStyle('PRIMARY')
      .setEmoji('➡️')
      .setCustomId('next')
  ]
)

const formater = (array) => {
  return `${array.join("\n")}`
}

const checkPageLimit = (currentPage, maxPage) => {
  if (currentPage <= 0) actionRow.components[0].setDisabled(true)
  else actionRow.components[0].setDisabled(false)

  if (currentPage == (maxPage - 1)) actionRow.components[1].setDisabled(true)
  else actionRow.components[1].setDisabled(false)
}
module.exports = {
  name: 'transações',
  description: '[Economia] - Veja suas transações conta bancaria de StarCoins',
  options: [
    {
      name: "user",
      description: "mencionar um usuário",
      type: "USER",
      required: false
    }
  ],
  
  run: async (client, interaction, guild) => {
    let user = interaction.options.getUser("user") || interaction.user
    let avatar = user.displayAvatarURL().replace("webp", "png", "gif")


    let transitionsDir = `user/${user.id}/economy/transitions`
    let transitions = await database.ref(transitionsDir).once('value')
    transitions = transitions.val() || []

    let erro = new Discord.MessageEmbed()
      .setDescription(`🚫 **Este usuario não possui um histórico de transações**`)
      .setColor('RED')
      .setTimestamp()

    if (transitions.length <= 0) return interaction.reply({ embeds: [erro]}) 

    let currentPage = 0
    let maxPage = Math.ceil(transitions.length / 10)

    if (maxPage == 1) actionRow.components[1].setDisabled(true)
    else actionRow.components[1].setDisabled(false)

    actionRow.components[0].setDisabled(true)

    let embed = new Discord.MessageEmbed()
      .setTitle(`💸 Transações de ${user.username}#${user.discriminator}`)
      .setDescription(formater(getPage(transitions, currentPage)))
      .setColor('BLUE')
      .setThumbnail(avatar)      
      .setFooter({ text: `Página atual: ${currentPage+1}/${maxPage} | Total de Transações: ${transitions.length}`})
      .setTimestamp()
    const reply = await interaction.reply({ embeds: [embed], components: [actionRow], fetchReply: true })

    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter })

    collector.on('collect', async (i) => {
    
      let choice = i.customId

      if (choice == "previous") currentPage = currentPage - 1
      if (choice == "next") currentPage = currentPage + 1

      embed.setDescription(
        formater(
          getPage(transitions, currentPage)
        )
      )
      embed.setFooter({ text: `Página atual: ${currentPage+1}/${maxPage} | Total de Transações: ${transitions.length}`})
      checkPageLimit(currentPage, maxPage)
      i.update({ embeds: [embed], components: [actionRow] })
      
    })            
  }
}
