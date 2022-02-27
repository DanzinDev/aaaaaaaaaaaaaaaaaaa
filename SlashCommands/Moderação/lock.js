const Discord = require("discord.js");
module.exports = {
  name: 'trancar',
  description: '[Moderação] - Tranque um canal para não mandarem mensagens nele',
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
            return interaction.reply(`:x: Eu preciso ter permissão de **gerenciar canais** para trancar esse canal`)
        }
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.reply(`:x: Você precisa ter permissão de **gerenciar canais** para trancar esse canal`)
        }

    let reason = motivo || 'Não especificado'

        if(canal) {

            reason = motivo || 'Não especificado'

        } else (

            canal = interaction.channel

        )

        if(canal.permissionsFor(guild.id).has('SEND_MESSAGES') === false) {

            return interaction.reply(`${interaction.user}\n**:lock: O canal ${canal} já está tracando!**`)

        }

        canal.permissionOverwrites.edit(guild.id, { SEND_MESSAGES: false })

        interaction.reply(`${interaction.user}\n**:lock: Canal tracando com sucesso!**\n:loudspeaker: **Canal:** ${canal}\n:scroll: **Motivo:** ${reason}`)

    }
  }