const Discord = require("discord.js");
module.exports = {
  name: 'invite',
  description: '[Sobremim] - Me convide para o seu servidor',
  run: async (client, interaction, guild) => {
    let servers = client.guilds.cache.size
    let members = client.users.cache.size
       let embed = new Discord.MessageEmbed()
      .setDescription(`**👋 Olá! Que tal me adicionar no seu servidor?**\n> *Estou em ${servers} servidores e ajudando ${members} pessoas*\nMe adicione no seu servidor!`)
      .setColor(`ORANGE`)
      .setThumbnail(client.user.displayAvatarURL())

       const button1 = new Discord.MessageButton()
      .setLabel("Suporte")
      .setStyle("LINK")
      .setEmoji('✉️')
      .setURL(`https://discord.gg/wpG7KjcUUh`);
      

    const button2 = new Discord.MessageButton()
      .setLabel("Me convide")
      .setStyle("LINK")
      .setEmoji('🧡')
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=785945276389130254&permissions=8&redirect_uri=https%3A%2F%2Fwebfoxy.repl.co%2Fthanks&response_type=code&scope=identify%20guilds%20bot%20applications.commands`);

      const button3 = new Discord.MessageButton()
      .setLabel("Vote em mim")
      .setStyle("LINK")
      .setEmoji('🏆')
      .setURL(`https://top.gg/bot/785945276389130254/vote`);

    const row = new Discord.MessageActionRow()
    .addComponents([button1, button2, button3]);

    return interaction.reply({ embeds: [embed], components: [row] });

    } 
}