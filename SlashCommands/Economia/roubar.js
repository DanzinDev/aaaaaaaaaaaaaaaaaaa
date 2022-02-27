const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
const fs = require("fs")
const moment = require('moment-timezone');
moment.locale('pt-BR')
const ms = require('../../Utils/parsems');

const regMoney = require('../../Utils/regMoney.js')

var gerarTextoRouboComSucesso = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **🤑 Roubou o(a) \`${user.username} (Id: ${user.id})\` e conseguiu ${money} StarCoins**`
}

var gerarTextoRouboSemSucesso = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **🚨 Tentou roubar o(a) \`${user.username} (Id: ${user.id})\` e perdeu ${money} StarCoins**`
}

var gerarTextoTeRoubaram = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **😬 O(a) \`${user.username} (Id: ${user.id})\` roubou ${money} StarCoins**`
}
  
module.exports = {
  name: 'roubar',
  description: '[Economia] - Pegue os StarCoins de alguém para você, mas isso terá consequências',
  options: [
    {
      name: "user",
      description: "mencionar um usuário",
      type: "USER",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const user = interaction.options.getUser("user");

    let cooldown = await database.ref(`user/${interaction.member.id}/cooldown/rob`).once('value')
  cooldown = cooldown.val() || 0

  let timeout = 10800000;
  if(timeout - (Date.now() - cooldown) > 0) {
    let time = ms(timeout - (Date.now() - cooldown));

    return interaction.reply(`**🚫 Você já roubou alguem hoje!\nVolte em: ${time.hours} hora(s), ${time.minutes} minutos, e ${time.seconds} segundos.**`)
  }

  if (!user) return interaction.reply(`**Você não disse quem vai roubar! :eyes:**`)

  if (user.id == client.user.id) return interaction.reply(`**Você não pode me roubar :kissing_heart:**`) 

  if (user.id === interaction.member.id) return interaction.reply(`**Você não pode roubar você mesmo**`)  
  
  let money_author = await database.ref(`user/${interaction.member.id}/economy/money`).once('value');
  money_author = money_author.val() || 0
  console.log(money_author)

  let money_user = await database.ref(`user/${user.id}/economy/money`).once('value');
  money_user = money_user.val() || 0

  if (money_user < 200) return interaction.reply(`**Você só consegue roubar o(a) ${user.tag}\nSe ele(a) tiver 200 StarCoins ou mais em mãos**`)

  let random = Math.floor(Math.random() * 200) + 50;
  let porcentagem = Math.floor(Math.random() * 100)

  if(porcentagem < 50) {
    
    await database.ref(`user/${interaction.member.id}/cooldown/rob`).set(Date.now())
          
    await database.ref(`user/${interaction.member.id}/economy/money`).set(money_author - random)  

    await regMoney(interaction.user, gerarTextoRouboSemSucesso(random, user))    
    

    return interaction.reply(`**Você tentou roubar o(a) ${user.tag} e falhou\n👮 Foi levado(a) para a prisão e perdeu ${random} StarCoins\n\nIsso é para aprender a não roubar o dinheiro e coisas das pessoas >:(**`)
    

  } else {

    await database.ref(`user/${interaction.member.id}/cooldown/rob`).set(Date.now())

    await database.ref(`user/${user.id}/economy/money`).set(money_user - random)

    await database.ref(`user/${interaction.member.id}/economy/money`).set(money_author + random)

    await regMoney(interaction.user, gerarTextoRouboComSucesso(random, user))

    await regMoney(user, gerarTextoTeRoubaram(random, interaction.user))

    return interaction.reply(`**:white_check_mark: Você roubou ${random} StarCoins de ${user.tag} com sucesso**`)
  }
  }

}