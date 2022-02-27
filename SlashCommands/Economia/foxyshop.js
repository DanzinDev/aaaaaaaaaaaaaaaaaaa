const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
const pets = require('../../Utils/pets.js').pets
const petsEmojis = require('../../Utils/pets.js').emojis
const imagePet = require('../../Utils/pets.js').imagepet

function gerarOptions() {
  let options = []

  for (var i = 0; i < pets.length; i++) {
    options.push({ label: String(pets[i]), value: String(i) })
  }

  return options
}

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('919286250953912421')
        .setCustomId('PESCAR'),
      new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setEmoji('851563044140351535')
        .setCustomId('PICARETA')
    ]
  )
module.exports = {
  name: 'foxyshop',
  description: '[Economia] - Compre itens para usar outros comandos e adote pets',
  options: [
    {
      name: "itens",
      description: "Comprar itens",
      type: 'SUB_COMMAND'
    },
    {
      name: "pets",
      description: "Adotar um pet",
      type: 'SUB_COMMAND'
    },
  ],
  run: async (client, interaction, guild, subCommand) => {
    let moeda = '<:FoxyPoint:915987107082809374>'
    let pointsDir = `user/${interaction.user.id}/economy/points`
    let points = await database.ref(pointsDir).once('value')
    points = points.val() || 0

    let pescarDir = `user/${interaction.user.id}/itens/pescar`
    let pescar = await database.ref(pescarDir).once('value')
    pescar = pescar.val() || 0

    let picaretaDir = `user/${interaction.user.id}/itens/picareta`
    let picareta = await database.ref(picaretaDir).once('value')
    picareta = picareta.val() || 0

    let petDir = `user/${interaction.user.id}/itens/pets`
    let pet = await database.ref(petDir).once('value')
    pet = pet.val()
    if (subCommand.name == "itens") {

      let vara_de_pescar = '<:vara_de_pescar:919286250953912421>'
      let picaretass = '<:picareta:851563044140351535>'
      let embed0 = new Discord.MessageEmbed()
        .setTitle(`<:shop:919286905978380318> LOJA DE ITENS`)
        .setDescription(`Opa, **${interaction.user.tag}**, Seja bem vindo(a) a loja de itens\nAqui você poderá comprar itens que te ajudará nos comandos\nVocê tem ${moeda} ${points} foxypoint`)

        .addField(`${vara_de_pescar} (10) Vara de pescar [${moeda} 2 foxypoint] `, `Você precisa de uma vara de pescar para usar o comando: **/pescar**`)

        .addField(`${picaretass} (10) Picareta [${moeda} 2 foxypoint]`, `Você precisa de uma picareta para usar o comando: **/minerar**`)

        .setColor('BLUE')
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp()

      const reply = await interaction.reply({
        embeds: [embed0],
        components: [actionRow],
        fetchReply: true
      })

      const filter = (b) => b.user.id === interaction.user.id
      const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
      collector.on('collect', async (i) => {
        if (i.customId == "PICARETA") {
          if (points < 2) return i.update(`**Você não tem ${moeda} \`2 foxypoint\`**`)

          await database.ref(pointsDir).set(points - 2)
          await database.ref(picaretaDir).set(picareta + 10)

          let sucesso_picareta = new Discord.MessageEmbed()
            .setTitle(`✅ COMPRA REALIZADA COM SUCESSO`)
            .setDescription(`**${interaction.user.tag}**, Você comprou ${picaretass} 10 Picareta\nAgora você tem: ${picaretass} ${picareta + 10} Picaretas`)
            .setColor(`GREEN`)

          i.update({ embeds: [sucesso_picareta], components: [] })
        }
        if (i.customId == "PESCAR") {
          if (points < 2) return i.update(`**Você não tem ${moeda} \`2 foxypoint\`**`)

          await database.ref(pointsDir).set(points - 2)
          await database.ref(pescarDir).set(pescar + 10)

          let sucesso_vara_de_pescar = new Discord.MessageEmbed()
            .setTitle(`✅ COMPRA REALIZADA COM SUCESSO`)
            .setDescription(`**${interaction.user.tag}**, Você comprou ${vara_de_pescar} 10 vara de pescar\nAgora você tem: ${vara_de_pescar} ${pescar + 10} vara de pescar`)
            .setColor(`GREEN`)
          i.update({ embeds: [sucesso_vara_de_pescar], components: [] })
        }
      })
    }
    if (subCommand.name == "pets") {
      if (pets[pet]) return await interaction.reply({ content: `💼** Você já tem um animal de estimação: ${pets[pet]}**`, ephemeral: true });

      let pet_shop = new Discord.MessageEmbed()
        .setTitle(`<:petshop:920368198283579412> PET SHOP`)
        .setDescription(`Olá, **${interaction.user.tag}**, Seja bem vindo(a) ao pet shop\nAqui você poderá adotar um animal de estimação\n\nATENÇÃO: Adote um animal na vida real, pois ele vai te deixar mais feliz e você estará deixando o animal feliz tambem :)`)
        .addField(`<:osso:920373989728223242> Adote um pet:`, `*Quando você escolher um pet, não poderá trocar mais*\n${pets.join("\n")}`)
        .setColor(`YELLOW`)


      const reply = await interaction.reply({
        embeds: [pet_shop],
        fetchReply: true,
        components: [
          new Discord.MessageActionRow()
            .addComponents(
              new Discord.MessageSelectMenu()
                .setCustomId("Nino")
                .setPlaceholder("Escolha um animal de estimação")
                .addOptions(gerarOptions())
            )
        ]
      })
      const filter = (b) => b.user.id === interaction.user.id
      const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
      collector.on("collect", async (i) => {
        if (pets[i.values[0]]) {
          await database.ref(petDir).set(String(i.values[0]))

          let sucesso = new Discord.MessageEmbed()
            .setTitle(`✅ Você adotou um pet com sucesso`)
            .setDescription(`Animal: **${pets[i.values[0]]}**\n*Cuide muito bem do pet!*`)
            .setColor(`GREEN`)

          return i.update({ embeds: [sucesso], components: [] })
        } else {
          return i.update({ content: `**Algo deu errado**`, components: [] })
        }
      })
    }
  }
}