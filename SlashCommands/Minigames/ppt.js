const Discord = require("discord.js");
const { MessageActionRow, MessageButton, InteractionCollector } = require('discord.js');

module.exports = {
  name: 'ppt',
  description: '[Minigames] - Jogue Pedra, Papel e Tesoura contra mim ou um user',
  options: [
    {
      name: "user",
      description: "mencionar um usuário",
      type: "USER",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {

    let startButtons = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('Pedra')
          .setLabel('Pedra')
          .setEmoji('🪨')
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setCustomId('Papel')
          .setLabel('Papel')
          .setEmoji('📃')
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setCustomId('Tesoura')
          .setLabel('Tesoura')
          .setEmoji('✂')
          .setStyle('PRIMARY')
      );


    let desafioButtons = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
          .setCustomId('Aceitar')
          .setEmoji('✅')
          .setStyle('PRIMARY'),
        new Discord.MessageButton()
          .setCustomId('Negar')
          .setEmoji('❌')
          .setStyle('PRIMARY'),
      );


    let user = interaction.options.getUser('user')
    let isBot = user.bot

    if (user.bot && user.id != client.user.id) {
      return await interaction.reply("Ala o corno, querendo mencionar bot kkkkkkkkkkkkkkk")
    }

    let desafioEmbed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('🪨 Pedra | 📃 Papel | ✂ Tesoura')
      .setDescription('Você foi desafiado para um pedra papel ou tesoura, clique no ✅ para aceitar!');
    let recusouEmbed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('🪨 Pedra | 📃 Papel | ✂ Tesoura')
      .setDescription('O usuario recusou!');
    let startEmbed = new Discord.MessageEmbed()
      .setColor('#00ffff')
      .setTitle('🪨 Pedra | 📃 Papel | ✂ Tesoura')
      .setDescription('Clique nos botões abaixo para começar');

    let reply;
    if (!isBot) {

      reply = await interaction.reply({
        content: user.toString(),
        embeds: [desafioEmbed],
        components: [desafioButtons],
        fetchReply: true
      });

      const filter = (i) => (i.user.id === user.id);

      const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
      collector.on('collect', async (i) => {

        let buttonId = i.customId

        if (buttonId == 'Negar') {
          return i.update({
            embeds: [recusouEmbed],
            components: []
          });
        } else {

          i.update({
            content: user.toString(),
            embeds: [startEmbed],
            components: [startButtons]
          });
        }

      })
    }

    const filterP = (i) => (i.user.id === interaction.user.id || i.user.id === user.id);

    const collectorP = reply.createMessageComponentCollector({ filterP, time: (5 * 60000) })

    let player1 = { value: null, emoji: null};
    let player2 = { value: null, emoji: null};

    collectorP.on('collect', async (i) => {
      if (i.customId == 'Negar' || i.customId == 'Aceitar') return;

      startEmbed.setDescription(i.user.username + " Já escolheu sua opção!")
      i.update({
        embeds: [startEmbed],
        components: [startButtons]
      }); 
      const values = ['Pedra', 'Papel', 'Tesoura'];
      const emojis = ['🪨', '📃', '✂'];

      const player = values.indexOf(i.customId);

      if (i.user.id == interaction.user.id && !player1.value){
        player1.value = values[player];
        player1.emoji = emojis[player];
      }

      if (i.user.id == user.id && !player2.value)
      {
        player2.value = values[player];
        player2.emoji = emojis[player];
      }

      if (!player1.value || !player2.value) return

      await i.update({
        content: "Sem ganhadores por enquanto!",
        embeds: [],
        components: []
      });
    })
    if (true) return
    await interaction.reply({
      embeds: [startEmbed],
      components: [startButtons]
    });



    let rounds = 0;
    let vitorias = 0;
    let derrotas = 0;
    let empates = 0;

    let cooldown = false;

    let vitoriaPercent = '';
    let derrotaPercent = '';
    let empatePercent = '';

    client.on('interactionCreate', async buttonInteraction => {

      await buttonInteraction.reply({ ephemeral: false });

      rounds++

      const player = values.indexOf(buttonInteraction.customId);

      const playerValue = values[player];
      const playerEmoji = emojis[player];

      const bot = Math.floor(Math.random() * 3);

      const botValue = values[bot];
      const botEmoji = emojis[bot];

      let resultEmbed = new Discord.MessageEmbed()
        .setTitle('🪨 Pedra | 📃 Papel | ✂ Tesoura')

      let description = `Você jogou: **${playerValue} ${playerEmoji}**\n\nEu joguei: **${botValue} ${botEmoji}**\n\n`

      if (playerValue == botValue) {
        empates++
        resultEmbed.setColor('YELLOW');
        description += 'Foi um empate! 🤝';

      } else if (
        (playerValue == 'Pedra' && botValue == 'Tesoura') ||
        (playerValue == 'Papel' && botValue == 'Pedra') ||
        (playerValue == 'Tesoura' && botValue == 'Papel')
      ) {
        vitorias++
        resultEmbed.setColor('GREEN');
        description += `🎉 Parabéns ${interaction.user}, você venceu!\n\n😭 Infelizmente, eu perdi`;

      } else {

        derrotas++
        resultEmbed.setColor('RED');
        description += `😭 Sinto muito ${interaction.user}, você perdeu...\n\n🎉 Eba, eu venci!`

      }

      vitoriaPercent = ((vitorias * 100) / rounds).toFixed(2);
      derrotaPercent = ((derrotas * 100) / rounds).toFixed(2);
      empatePercent = ((empates * 100) / rounds).toFixed(2);
      while (vitoriaPercent.endsWith('0')) vitoriaPercent = vitoriaPercent.slice(0, -1);
      while (derrotaPercent.endsWith('0')) derrotaPercent = derrotaPercent.slice(0, -1);
      while (empatePercent.endsWith('0')) empatePercent = empatePercent.slice(0, -1);
      if (vitoriaPercent.endsWith('.')) vitoriaPercent = vitoriaPercent.slice(0, -1);
      if (derrotaPercent.endsWith('.')) derrotaPercent = derrotaPercent.slice(0, -1);
      if (empatePercent.endsWith('.')) empatePercent = empatePercent.slice(0, -1);

      resultEmbed
        .setDescription(description)
        .addFields(
          { name: 'Partidas:', value: rounds.toString() },
          { name: 'Vitórias:', value: `${vitorias} • ${vitoriaPercent}%`, inline: true },
          { name: 'Derrotas:', value: `${derrotas} • ${derrotaPercent}%`, inline: true },
          { name: 'Empates;', value: `${empates} • ${empatePercent}%`, inline: true }
        );

      buttonInteraction.deleteReply();

    });

  }
}