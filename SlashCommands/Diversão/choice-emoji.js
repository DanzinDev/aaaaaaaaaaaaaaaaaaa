const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
module.exports = {
  name: 'escolher-emoji',
  description: '[Diversão] - Eu irei escolher um emoji pra você aleatoriamente',
  options: [
    {
      name: "user",
      description: "mencionar um usuário",
      type: "USER",
      required: false
    }
  ],
  run: async (client, interaction, guild) => {
    const user = interaction.options.getUser("user");
    let member;
    if (user) member = interaction.guild.members.cache.get(user.id);
    else member = interaction.member;   

    var replies = [
    "😁 Alegre",
    "😋 Faminto(a)",
    "😞 Triste",
    "😡 Raivoso(a)",
    "😇 Bondoso(a)",
    "😈 Malvado(a)",
    "😎 Descolado(a)",
    "😒 Serio(a)",
    "👀 Fofoqueiro(a)",
    "🤐 Quieto(a)",
    "🤓 Estudioso(a)",
    "🤡 Palhaço(a)",
    "😱 Medroso(a)",
    "🥴 Louco(a)",
    "🤥 Mentiroso(a)"
    ]

    var result = Math.floor((Math.random() * replies.length));
    interaction.reply(`O emoji de ${member} é o: ${replies[result]}`)

  }
}