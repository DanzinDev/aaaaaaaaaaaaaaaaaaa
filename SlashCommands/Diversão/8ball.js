const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
module.exports = {
  name: '8ball',
  description: '[Diversão] - Faça perguntas de sim ou não para eu responder',
  
  options: [
    {
      name: "texto",
      description: "pergunte algo",
      type: "STRING",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const message = interaction.options.getString("texto");

  var replies = [
        'Sim.',
        'Não.',
        'Não sei.',
        'Provavelmente sim.',
        'Provavelmente não.',
        'Verdade.',
        'Nunca na vida.',
        'Concordo.',
        'Discordo',
        'Pode ser...',
        'Talvez',
        'Claro que sim',
        'Claro que não'
    ]

    var result = Math.floor((Math.random() * replies.length));
    interaction.reply(`${replies[result]}`)
    
  }
}