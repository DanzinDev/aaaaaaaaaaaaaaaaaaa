const Discord = require("discord.js");
module.exports = {
  name: 'destrancar',
  description: '[Moderação] - Destranque um canal para mandarem mensagens nele',
  permission: 'MANAGE_CHANNELS',
  options: [
    {
      name: "canal",
      description: "Coloque um canal",
      type: "CHANNEL",
      channelTypes: ['GUILD_TEXT'],
      required: true
    },
    {
      name: "motivo",
      description: "Coloque um motivo",
      type: "STRING",
      required: false
    }
  ],

  run: async (client, interaction, guild) => {
    const canal = interaction.options.getChannel("canal");
    const motivo = interaction.options.getString("motivo");

    if (!guild.me.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply(`:x: Eu preciso ter permissão de **gerenciar canais** para destrancar esse canal`)
        }
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply(`:x: Você precisa ter permissão de **gerenciar canais** para destrancar esse canal`)
        }

    let reason = motivo || 'Não especificado'

        if(canal) {

            reason = motivo || 'Não especificado'

        } else (

            canal = interaction.channel

        )

        if(canal.permissionsFor(guild.id).has('SEND_MESSAGES') === true) {

            return interaction.reply(`**:unlock: O canal ${canal} já está destracando!**`)

        }

        canal.permissionOverwrites.edit(guild.id, { SEND_MESSAGES: true })

        interaction.reply(`**:unlock: Canal destracando com sucesso!**\n:loudspeaker: **Canal:** ${canal}\n:scroll: **Motivo:** ${reason}`)

    }
  }