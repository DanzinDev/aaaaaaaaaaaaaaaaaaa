const Discord = require("discord.js");
const weather = require('weather-js');  
const fs = require('fs')
module.exports = {
  name: "clima",
  description: "[Informativo] - Irei dizer a previsão do tempo",
  options: [{
    name: "local",
    description: "Coloque um local",
    type: "STRING",
    required: true
  },],
  run: async (client, interaction, guild) => {
    const local = interaction.options.getString('local')

    weather.find({
    search: local,
    degreeType: 'C' 
  }, function (err, result) {       
    if (!result[0]) return interaction.reply(`**Não foi possivel achar esse local**`)
    var location = result.location;

    let embed = new Discord.MessageEmbed()
      .setDescription(`**Clima de ${result[0].location.name}**`)
      .addField(`**🌡️ Temperatura**`, `${result[0].current.temperature}°C`)
      .addField(`**Sensação Térmica**`, `${result[0].current.feelslike}°C`)
      .addField(`**☁️ Umidade**`, `${result[0].current.humidity}%`)
      .addField(`**🍃 Vento**`, `${result[0].current.windspeed}`)
      .setColor('RED')
      .setThumbnail(result[0].current.imageUrl)

    interaction.reply({embeds: [embed]})
  });
  }
};