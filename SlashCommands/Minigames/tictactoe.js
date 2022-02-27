const { MessageActionRow, MessageButton, InteractionCollector } = require('discord.js');
module.exports = {
  name: 'tictactoe',
  description: '[Minigames] - Jogue o jogo da velha com alguem',
  options: [
    {
      name: "user",
      description: "mencionar um usuário",
      type: "USER",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    
const components = [], rows = [[0,0,0], [0,0,0], [0,0,0]],
      user = interaction.options.getUser('user');
    if(user.id === interaction.user.id || user.bot) return interaction.reply('**Você não pode jogar com esse usuário!**');
    let turn = user.id;
    for (let i = 0; i < 3; i++) {
      const buttons = [];
      for (let j = 0; j < 3; j++) {
        buttons.push(new MessageButton().setCustomId(`${interaction.id}|${i}|${j}`).setLabel('❓').setStyle('SECONDARY'));
      }
      components.push(new MessageActionRow().addComponents(buttons));
    }
    const message = await interaction.reply({ content: `#️⃣ ${user} é sua vez`, components });
    
    const filter = (i) => i.customId.startsWith(interaction.id) && (i.user.id === interaction.user.id || i.user.id === user.id);
    const collector = new InteractionCollector(client, { filter, time: 6e5, idle: 6e4, message });
    collector.on('collect', async i => {
      const a = i.customId.split('|'),
        self = i.user.id === interaction.user.id ? true : false;
      
      if(i.user.id !== turn || rows[a[1]][a[2]] !== 0) return i.update({ fetchReply: false });
      rows[a[1]][a[2]] = self ? 1 : 2;
      components[a[1]].components[a[2]]
        .setLabel(`${self ? '❌' : '⭕'}`)
        //.setStyle(self ? 'DANGER' : 'SUCCESS')
        .setStyle('DANGER')
        .setDisabled();
      turn = self ? user.id : interaction.user.id;
      if(checkWin(rows)) {
        const winner = checkWin(rows) === 1 ? interaction.user : user;
        collector.stop();
        components.forEach(c => c.components.forEach(b => b.setDisabled()));
        return await i.update({ content: `#️⃣ ${winner} GANHOU O JOGO 🥳🥳🥳!`, components });
      }
      if(checkTie(rows)) {
        collector.stop();
        return await i.update({ content: '#️⃣ Ninguem ganhou, o jogo deu velha!', components });
      }
      await i.update({ content: `#️⃣ <@!${turn}> é sua vez`, components });
    });
    collector.on('end', (_, r) => {
      if(r !== 'user') {
        components.forEach(c => c.components.forEach(b => b.setDisabled()));
        interaction.editReply({ content: `#️⃣ O jogo terminou! (${r} limite alcançado)`, components });
      }
    });
  }
};

function checkWin(rows) {
  for (let i = 0; i < 3; i++) {
    if(rows[i][0] === rows[i][1] && rows[i][1] === rows[i][2]) return rows[i][0];
  }
  for (let i = 0; i < 3; i++) {
    if(rows[0][i] === rows[1][i] && rows[1][i] === rows[2][i]) return rows[0][i];
  }
  if(rows[0][0] === rows[1][1] && rows[1][1] === rows[2][2]) return rows[0][0];
  if(rows[0][2] === rows[1][1] && rows[1][1] === rows[2][0]) return rows[0][2];
  return false;
}

function checkTie(rows) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if(rows[i][j] === 0) return false;
    }
  }
  return true;
}