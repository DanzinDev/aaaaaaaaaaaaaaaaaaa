const Discord = require('discord.js');
const { default: axios } = require('axios');
module.exports = {
  name: 'dicionario',
  description: '[Informativo] - Mostrarei o significado de uma palavra',
  options: [{
    name: "palavra",
    description: "Escreva uma palavra",
    type: "STRING",
    required: true
  },],

  run: async (client, interaction, guild) => {
    const palavra = interaction.options.getString('palavra')
  axios.get(`https://significado.herokuapp.com/meanings/${palavra}`)
  .then((res) => {
    let embed = new Discord.MessageEmbed()
      .setTitle(`:scroll: Significado de ${palavra}`)
      .setTimestamp()
      .setColor(`GREEN`)
      .setThumbnail(`https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/bookmark_1f516.png`)

      for (let data in res.data) {
        //embed.setDescription(`*${res.data[0].class}*\n:bookmark: **${res.data[0].meanings[0]}**`)
        //console.log(data)
        embed.addField(`*${res.data[data].class}*`, `**:bookmark: ${res.data[data].meanings[0]}**`)
      }
      //console.log(res.data)
   interaction.reply({ embeds: [embed]})
  }).catch((err) => {
    interaction.reply(`Ops! Algo deu errado! Verifique se você digitou a palavra corretamente. Erro: ${err}`);
  })
}
}