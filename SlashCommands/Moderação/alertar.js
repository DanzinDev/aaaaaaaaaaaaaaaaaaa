const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('SUCCESS')
        .setEmoji('✅')
        .setLabel('Sim')
        .setCustomId('ACEITO'),
      new Discord.MessageButton()
        .setStyle('DANGER')
        .setEmoji('❌')
        .setLabel('Não')
        .setCustomId('NEGO')
    ]
  )  


module.exports = {
  name: 'alertar',
  description: '[Moderação] - Enviar um alerta para alguem que está desobedecendo as regras',
  permission: 'ADMINISTRADOR',
  options: [
    {
      name: 'user',
      description: 'Mencione um usuario',
      type: 'USER',
      required: true
    },
    {
      name: 'motivo',
      description: 'Diga o motivo do alerta',
      type: 'STRING',
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const user = interaction.options.getUser('user')
    const motivo = interaction.options.getString('motivo')

if (!interaction.member.permissions.has('ADMINISTRADOR')) {
            return interaction.reply(`:x: Você precisa ter permissão de **administrador** para enviar um alerta para alguem`)
        }

    let warningsDir = `guild/${guild.id}/user/${user.id}/warnings`

    let warning = await database.ref(warningsDir).once('value')
    warning = warning.val() || 0

if (user.id === client.user.id) return interaction.reply("**Nossa, você quer dá um alerta em mim 😢**")

if (user.id === guild.ownerId)
       return interaction.reply("**Você não pode enviar um alerta para o dono do servidor**")

    let confirmação = new Discord.MessageEmbed()
      .setDescription(`
❓ **Você tem certeza disso?**
${user.tag} levará **1 alerta**
🔖 Motivo: **${motivo}**`)
.setColor(`BLUE`)

    const reply = await interaction.reply({
      embeds: [confirmação],
      components: [actionRow],
      fetchReply: true
    })
    const filter = (b) => b.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {

      if (i.customId == "ACEITO") {

await database.ref(warningsDir).set(warning + 1)

if(warning + 1 >= 5) {
  let atenção = new Discord.MessageEmbed()
.setColor("RED")
.setThumbnail(user.displayAvatarURL())

.setDescription(`
${user.tag} Atingiu (${warning + 1}/5)
Isso já é muito grave 😬
⚠️ **Atenção Equipe De Moderação Do Servidor!**
${user.tag} já tem **${warning + 1} alertas!!!**
`);
       return i.update({ embeds: [atenção], components: [] });
}

let sucesso = new Discord.MessageEmbed()
      .setDescription(`
🚨 ${user.tag} recebeu **1 alerta!**
🔖 Motivo: ${motivo}
👮 Responsavel pelo o alerta: ${interaction.user.tag}
`)
.setThumbnail(user.displayAvatarURL())
.setColor(`GREEN`)

        return i.update({ embeds: [sucesso], components: [] })

      } else {
        return i.update({ content: `Acho que foi engano :/`, components: [], embeds: [] })
      }
    })
                 }
}