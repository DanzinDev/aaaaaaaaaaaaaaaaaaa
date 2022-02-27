const ms = require('../../Utils/parsems');
const Discord = require('discord.js');
const moment = require("moment");
moment.locale('pt-BR')

module.exports = {
  name: 'userinfo',
  description: '[Discord] - Informações de algum user',
  options: [
    {
      name: "user",
      description: "Mencionar um usuário",
      type: "USER",
      required: false
    }
  ],
  run: async (client, interaction, guild) => {

    const user = interaction.options.getUser("user");
    let member;
    if (user) member = interaction.guild.members.cache.get(user.id);
    else member = interaction.member;

    let bot;
    if (member.user.bot === true) {
      bot = "✅ Bot do discord";
    } else {
      bot = "❌ Não é um bot";
    }

    permissões = {
      "CREATE_INSTANT_INVITE": "Criar convite instantâneo",
      "KICK_MEMBERS": "Expulsar usuários",
      "BAN_MEMBERS": "Banir usuários",
      "ADMINISTRATOR": "Administrador",
      "MANAGE_CHANNELS": "Gerenciar canais",
      "MANAGE_GUILD": "Gerenciar servidor",
      "ADD_REACTIONS": "Adicionar reação",
      "VIEW_AUDIT_LOG": "Ver registro de auditoria",
      "VIEW_CHANNEL": "Ver canais",
      "READ_MESSAGES": "Ver mensagens",
      "SEND_MESSAGES": "Enviar mensagens",
      "SEND_TTS_MESSAGES": "Enviar mensagens com aúdio",
      "MANAGE_MESSAGES": "Gerenciar mensagens",
      "EMBED_LINKS": "Links em embed",
      "ATTACH_FILES": "Arquivos arquivados",
      "READ_MESSAGE_HISTORY": "Ver histórico de mensagens",
      "MENTION_EVERYONE": "Mencionar todos",
      "EXTERNAL_EMOJIS": "Emojis externos",
      "USE_EXTERNAL_EMOJIS": "Usar emojis externos",
      "CONNECT": "Conectar",
      "SPEAK": "Falar",
      "MUTE_MEMBERS": "Silenciar usuários",
      "DEAFEN_MEMBERS": "Perdoar usuários",
      "MOVE_MEMBERS": "Mover usuários",
      "USE_VAD": "Usar detecção de voz",
      "PRIORITY_SPEAKER": "Prioridade para falar",
      "CHANGE_NICKNAME": "Trocar apelido",
      "MANAGE_NICKNAMES": "Gerenciar apelidos",
      "MANAGE_ROLES": "Gerenciar cargos",
      "MANAGE_ROLES_OR_PERMISSIONS": "Gerenciar cargos e permissões",
      "MANAGE_WEBHOOKS": "Gerenciar webhooks",
      "MANAGE_EMOJIS": "Gerenciar emojis"
    }

    const status = {
      online: "Online",
      idle: "Ausente",
      dnd: "Ocupado(a)",
      offline: "Offline"
    };

    let embed = new Discord.MessageEmbed()
      .setThumbnail(member.user.displayAvatarURL())
      .setColor("ORANGE")
      .addField(":pencil: Nome:", `\`${member.user.username}\``)

      .addField("☕ Status:", `${status[guild.members.cache.get(member.id).presence.status]}`)

      .addField("📜 Tag:", `\`#${member.user.discriminator}\``)

      .addField("🤖 Verificação de bot:", `${bot}`)

      .addField("✍ Criação da conta:", `\`${moment(member.user.createdAt).format("LLL")}\``, true)

      .addField('🚪 Entrou no servidor:', `\`${moment(member.joinedAt).format("LLL")}\``)

      .addField("✅ Permissões:", `${member.permissions.toArray().map(perms => `\`${permissões[perms]}\``).join(", ")}`)

      .addField(`💼 Cargos:`, `\`${member.roles.cache.filter(r => r.id !== guild.id).map(a => `\`${a.name}\``).length} Cargos\``, true)

    interaction.reply({ embeds: [embed] })
  }
};