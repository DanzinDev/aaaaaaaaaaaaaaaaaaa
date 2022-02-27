const Discord = require("discord.js");
module.exports = {
  name: 'shipar',
  description: '[Diversão] - Forme casais',
  options: [
    {
      name: "user1",
      description: "mencionar um usuário",
      type: "USER",
      required: true
    },
    {
      name: "user2",
      description: "mencionar +1 usuário",
      type: "USER",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const user1 = interaction.options.getUser("user1");
    const user2 = interaction.options.getUser("user2");

    let u1 = `${user1.username}`
    let u2 = `${user2.username}`

    let nome_casal = u1.substr(0, Math.round(u1.length / 2)) + u2.substr(u2.length - Math.round(u2.length / 2))

    var replies = ["10% Esse casal é impossivel de ficar juntos", "25% Alguma coisa vai rolar..", "47% HUMM, Será que forma um casal?", "64% EITA CASAL LINDO!", "82% O amor é tão lindo", "100% O AMOR ESTÁ NO AR"];


    var result = replies[Math.floor((Math.random() * replies.length))];

    let embed = new Discord.MessageEmbed()
      .setColor("#DC143C")
      .setTitle(`${user1.username} ❤ ${user2.username} = ${nome_casal}`)
      .setDescription(`**${result}**`)
      .setThumbnail("https://images.emojiterra.com/google/android-11/128px/2764.png")
      .setFooter({ text: `foxy, O cupido do amor💘`})
      .setTimestamp()
    interaction.reply({ embeds: [embed]})
  }
}
