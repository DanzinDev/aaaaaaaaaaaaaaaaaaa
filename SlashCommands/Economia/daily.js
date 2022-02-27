const ms = require('../../Utils/parsems');
const admin = require("firebase-admin");
const database = admin.database();

module.exports = {
  name: 'daily',
  description: '[Economia] - Pegue sua recompensa diaria',
  run: async (client, interaction, guild) => {
    let cooldownDir = `user/${interaction.member.id}/cooldown/daily`
  let cooldown = await database.ref(cooldownDir).once('value')
  cooldown = cooldown.val()


  let timeout = 86400000;

  if(timeout - (Date.now() - cooldown) < 0) {
    interaction.reply(`🗓️ Pegue sua recompensa diaria\nhttps://webfoxy.repl.co/dashboard/daily`)
  }
  let time = ms(timeout - (Date.now() - cooldown));

  return interaction.reply(`**🚫 Você já coletou seu daily hoje!\nVolte em: ${time.hours} hora(s), ${time.minutes} minutos, e ${time.seconds} segundos.**`)
  }  
}