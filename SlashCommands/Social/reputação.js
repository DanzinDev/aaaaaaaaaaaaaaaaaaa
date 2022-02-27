const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
const moment = require('moment-timezone');
moment.locale('pt-BR')
const ms = require('../../Utils/parsems');
const regMoney = require('../../Utils/regMoney.js')

var gerarTextoEnviou = (user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💖 Mandou 1 agradecimento para \`${user.username} (Id: ${user.id})\`**`
}
var gerarTextoRecebeu = (user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💖 Recebeu 1  agradecimento de \`${user.username} (Id: ${user.id})\`**`
}

module.exports = {
  name: "reputação",
  description: "[Social] - Envie um agradecimento para alguem",
  options: [
    {
    name: "user",
    description: "mencione um usuario",
    type: "USER",
    required: true
  },
  ],
  run: async (client, interaction, guild) => {
    const user = interaction.options.getUser("user");    

    let timeout = 20000000
    let repMDir = `user/${user.id}/social/reputations`
  
    let cooldownUDir = `user/${interaction.user.id}/cooldown/reputations`

    if (user.id === interaction.user.id) {
      return interaction.reply(`**Você não pode dar reputação pra si mesmo!!!**`);
    }
    let timerRep = await database.ref(cooldownUDir).once('value')
  
    timerRep = timerRep.val()
  
    if (timerRep !== null && timeout - (Date.now() - timerRep) > 0) { 
      let time = ms(timeout - (Date.now() - timerRep));      
      return interaction.reply(`**:no_entry_sign: Você já deu agradecimento para alguém!\n**Espere: ${time.hours}h ${time.minutes}m ${time.seconds}s**`)
    }

    var reps = await database.ref(repMDir).once('value')
    reps = reps.val()
    if (!reps) reps = 0;  
    await database.ref(repMDir).set(reps + 1)
  
  await regMoney(interaction.user, gerarTextoEnviou(user))
  await regMoney(user, gerarTextoRecebeu(interaction.user))

  database.ref(cooldownUDir).set(Date.now())

let texto = (reps + 1 == 1) ? "agradecimento" : "agradecimentos"

  interaction.reply(`**${user.username} ganhou +1 agradecimento\n🗂️ Agora ele(a) tem: ${reps + 1} ${texto}, graças ao ${interaction.user}**`)
  }
}