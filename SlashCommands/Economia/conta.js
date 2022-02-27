const Discord = require('discord.js')
var admin = require("firebase-admin");
let database = admin.database();
const moment = require('moment-timezone');
moment.locale('pt-BR')
const regMoney = require('../../Utils/regMoney.js')

var gerarTextoDep = (money) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **📥 Depositou ${money} StarCoins no banco**`
}

var gerarTextoSac = (money) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **📤 Sacou ${money} StarCoins do banco**`
}

let starcoins = '<:StarCoins:851563806315905024>'
module.exports = {
  name: 'conta',
  description: '[Economia] - Deposite ou saque seus StarCoins',
  options: [
    {
      name: "depositar",
      description: "Deposite seus starcoins",
      type: 'SUB_COMMAND',
      options: [
        {
          name: "quantia",
          description: "Diga quantos StarCoins você deseja depositar",
          type: "STRING",
          required: true
        }
      ]
    },
    {
      name: "sacar",
      description: "Saque seus starcoins",
      type: 'SUB_COMMAND',
      options: [
        {
          name: "quantia",
          description: "Diga quantos StarCoins você deseja sacar",
          type: "STRING",
          required: true
        }
      ]
    },
  ],
  run: async (client, interaction, guild, subCommand) => {
    let moneyDir = `user/${interaction.user.id}/economy/money`
    let bankDir = `user/${interaction.user.id}/economy/bank`

    let money = await database.ref(moneyDir).once('value')
    let bank = await database.ref(bankDir).once('value')

    money = money.val() || 0
    bank = bank.val() || 0

    let quantia = interaction.options.getString("quantia");

    if (subCommand.name == "depositar") {

      if (isNaN(quantia)) {
        if (quantia == "all") quantia = money
        else return interaction.reply(`**❌ Você não indicou um numero, ou escreveu all!**`)
      }
      quantia = Number(quantia)
      if (money < quantia) return interaction.reply(`**❌ Você não possui ${starcoins} ${quantia} StarCoins nas mãos**`)
    
      if (quantia <= 0) return interaction.reply(`**Você precisa depositar uma quantia maior que 0!**`)

      await database.ref(moneyDir).set(money - Number(quantia))
      await database.ref(bankDir).set(bank + Number(quantia))
      await regMoney(interaction.user, gerarTextoDep(quantia))
  
      return interaction.reply(`🏦 Você depositou **${quantia} ${starcoins} StarCoins** na sua conta!`)
    }
    if (subCommand.name == "sacar") {

      if (isNaN(quantia)) {
        if (quantia == "all") quantia = bank
        else return interaction.reply(`**❌ Você não indicou um numero, ou escreveu all!**`)
      }
      quantia = Number(quantia)
      if (bank < quantia) return interaction.reply(`**❌ Você não possui ${starcoins} ${quantia} StarCoins no banco**`)
    
      if (quantia <= 0) return interaction.reply(`**Você precisa sacar uma quantia maior que 0!**`)

      await database.ref(moneyDir).set(money + Number(quantia))
      await database.ref(bankDir).set(bank - Number(quantia))
      await regMoney(interaction.user, gerarTextoSac(quantia))
  
      return interaction.reply(`🏦 Você sacou **${quantia} ${starcoins} StarCoins** da sua conta!`)
    }
  }
}