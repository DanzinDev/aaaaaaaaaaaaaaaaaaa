const Discord = require("discord.js");
var admin = require("firebase-admin");
let database = admin.database();
module.exports = {
  name: "sobremim",
  description: "[Social] - Escreve uma descrição para seu perfil",
  options: [{
    name: "mensagem",
    description: "Escreva algo",
    type: "STRING",
    required: true
  },],
  run: async (client, interaction, guild) => {
    const message = interaction.options.getString('mensagem')

  const bioDir = `user/${interaction.user.id}/social/aboutme`     
  let premium = await database.ref(`user/${interaction.user.id}/social/premium`).once('value')
  premium = premium.val()
  premium = premium ? 50 : 0

     if (message.length > premium+50) {
    return interaction.reply(`A sua descrição passou de **${premium+50}**, tente encurtar ela!`); 
  };

  database.ref(bioDir).set(message)
  interaction.reply(`✅ Você alterou sua descrição com sucesso!`)
  }
}