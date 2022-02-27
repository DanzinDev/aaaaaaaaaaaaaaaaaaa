const Discord = require("discord.js");
const admin = require("firebase-admin");
const db = admin.database();
const empregos = require('../../Utils/works.js').empregos
const pets = require('../../Utils/pets.js').pets
const imagePet = require('../../Utils/pets.js').imagepet

      const actionRow = new Discord.MessageActionRow()
    .addComponents(
        [
            new Discord.MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('⬅️')
                .setCustomId('VOLTAR'),
                new Discord.MessageButton()
                .setStyle('PRIMARY')
                .setEmoji('➡️')
                .setCustomId('PASSAR')
        ]
    )
module.exports = {
  name: "perfil",
  description: "[Social] - Veja seu perfil",
  options: [{
    name: "user",
    description: "mencione um usuario",
    type: "USER",
    required: false
  },],
  run: async (client, interaction, guild) => {
    const userr = interaction.options.getUser("user");
    let member;
  if(userr) member = guild.members.cache.get(userr.id);
  else member = interaction.member;
  

    let avatar = member.displayAvatarURL().replace("webp", "png", "gif")
  const perfil = new Discord.MessageEmbed()
    .setThumbnail(avatar)
    .setTimestamp()

  let color = await db.ref(`user/${member.id}/social/color`).once('value')
  color = color.val()
  color = color ? color : "#9900ff"
  perfil.setColor(`${color}`)

  let sobremim = await db.ref(`user/${member.id}/social/aboutme`).once('value')
  sobremim = sobremim.val()
  sobremim = sobremim ? sobremim : "Nenhuma biografia definida"
  perfil.addField("<:biografia:855895432332967967> Descrição:", `**${sobremim}**`)

  let banner = await db.ref(`user/${member.id}/social/banner`).once('value')
  banner = banner.val()
  bannerm = banner ? banner : null
  perfil.setImage(banner)

  let relacionamento = await db.ref(`user/${member.id}/social/marry`).once('value')
  relacionamento = relacionamento.val()
  relacionamento = relacionamento ? client.users.cache.get(relacionamento).tag : `Solteiro(a)`
  perfil.addField(":sparkling_heart: Relacionamento: ", `**${relacionamento}**`, true)

  let reps = await db.ref(`user/${member.id}/social/reputations`).once('value')
  reps = reps.val()
  reps = reps ? reps : 0
  perfil.addField(":love_letter: Reputações:", `**${reps} Reps**`, true)

  let premium = await db.ref(`user/${member.id}/social/premium`).once('value')
  premium = premium.val()
  premium = premium ? `<:SOU_PREMIUM:887921705450864660> É premium!` : `:smiling_face_with_tear: Não possui premium!`
  perfil.addField(":medal: Premium:", `**${premium}**`)

  let emprego = await db.ref(`user/${member.id}/social/work`).once('value')
  emprego = emprego.val()
  emprego = emprego ? empregos[emprego] : `Desempregado(a)`
  if (member.bot) emprego = `<:discord:851563043887644723> Bot do discord`
  perfil.addField("<:maleta:855891160278761482> Emprego:", `**${emprego}**`)

  let money = await db.ref(`user/${member.id}/economy/money`).once('value')
  money = money.val()
  money = money ? money : 0
  perfil.addField("<:dinheiro:855893280302825483> StarCoins:", `**${money} StarCoins <:StarCoins:851563806315905024>**`, true)

  let level = await db.ref(`guild/${guild.id}/user/${member.id}/levels/level`).once('value')
  level = level.val()
  level = level ? level : 0
  perfil.addField("<:level:897303410024542270> Level:", `**Level ${level}**`, true)

  let xp = await db.ref(`guild/${guild.id}/user/${member.id}/levels/xp`).once('value')
  xp = xp.val()
  xp = xp ? xp : 0
  perfil.addField("<a:xp:897302222424145961> Experiencia:", `**${xp} xp**`, true)
const reply = await interaction.reply({
            embeds: [perfil],
            components: [actionRow],
            fetchReply: true
        })

        let pet = await db.ref(`user/${member.id}/itens/pets`).once('value')
      pet = pet.val()
      const petss = new Discord.MessageEmbed()
      .addField(`Pet:`, `${pets[pet] || `Não tem nenhum pet ainda!`}`)
      .setImage(`${imagePet(pet)}`)
      .setTimestamp()    
      .setColor(color)  

  const filter = (b) => b.user.id === interaction.user.id
        const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })

        collector.on('collect', async (i) => {
            switch (i.customId) {
               case 'VOLTAR':
                    return i.update({embeds: [perfil]})
                    break;
                case 'PASSAR':
                    return i.update({embeds: [petss]})
                    break;
            }
        })
  }
}