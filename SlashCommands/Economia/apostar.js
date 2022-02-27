const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();
const ms = require('../../Utils/parsems');
const regMoney = require('../../Utils/regMoney.js')
const moment = require('moment-timezone');
moment.locale('pt-BR')

var gerarTextoGanhou = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💸 Apostou ${money} StarCoins e ganhou!**`
}

var gerarTextoPerdeu = (money, user) => {
  return `\`[${moment().tz("America/Sao_Paulo").format('HH:mm DD/MM/YYYY')}]\` • **💸 Apostou ${money} StarCoins e perdeu!**`
}

const actionRow = new Discord.MessageActionRow()
  .addComponents(
    [
      new Discord.MessageButton()
        .setStyle('SUCCESS')
        .setEmoji('✅')
        .setLabel('Sim')
        .setCustomId('ACEITO'),
      new Discord.MessageButton()
        .setStyle('DANGER')
        .setEmoji('❌')
        .setLabel('Não')
        .setCustomId('NEGO')
    ]
  )  

module.exports = {
  name: 'apostar',
  description: '[Economia] - Aposte seus StarCoins com alguém',
  options: [
    {
      name: "user",
      description: "mencionar um usuário",
      type: "USER",
      required: true
    },
    {
      name: "quantia",
      description: "diga quanto quer apostar",
      type: "NUMBER",
      required: true
    }
  ],
  run: async (client, interaction, guild) => {
    const user = interaction.options.getUser("user");
    const quantia = interaction.options.getNumber("quantia");

    let moneyUDir = `user/${interaction.member.id}/economy/money`
    let moneyMDir = `user/${user.id}/economy/money`

    let moneyU = await database.ref(moneyUDir).once('value')
    moneyU = moneyU.val() || 0

    let moneyM = await database.ref(moneyMDir).once('value')
    moneyM = moneyM.val() || 0

    if (user.id == client.user.id) return interaction.reply(`**Você não pode apostar comigo, eu já sou muito rico :fox::moneybag:**`);

    if (user.id === interaction.user.id) return interaction.reply(`**Você não pode apostar com você mesmo**`)

    if (quantia <= 0) return interaction.reply(`**Você precisa colocar um numero maior que 0**`)

    if (moneyU < quantia) return interaction.reply(`**Você não tem ${quantia} StarCoins**`)

    if (moneyM < quantia) return interaction.reply(`**${user.username} não tem ${quantia} StarCoins**`)

    const reply = await interaction.reply({
      content: `**${user}\n${interaction.user.username} quer apostar ${quantia} StarCoins com você!\n❓ Você vai aceitar apostar?**`,
      components: [actionRow],
      fetchReply: true
    })

    const filter = (b) => b.user.id === user.id
    const collector = reply.createMessageComponentCollector({ filter, time: (5 * 60000) })
    collector.on('collect', async (i) => {
      const jogadores = [interaction.user, user];
      const escolhido = jogadores[Math.floor(Math.random() * jogadores.length)];

      let escolhidoDir = `user/${escolhido.id}/economy/money`

      if (i.customId == "ACEITO") {

        let moneyEscolhido = await database.ref(escolhidoDir).once('value')
        moneyEscolhido = moneyEscolhido.val() || 0

        database.ref(escolhidoDir).set(Number(moneyEscolhido) + Number(quantia))        

        const perdedor = jogadores.filter(jogador => jogador.id != escolhido.id);
        let perdedorDir = `user/${perdedor[0].id}/economy/money`

        let moneyPerdedor = await database.ref(perdedorDir).once('value')
        moneyPerdedor = moneyPerdedor.val() || 0

        database.ref(perdedorDir).set(Number(moneyPerdedor) - Number(quantia))

         await regMoney(escolhido, gerarTextoGanhou(quantia))

        interaction.editReply({ content: `${escolhido}\n🎉 **Parabéns**, **você ganhou <:StarCoins:851563806315905024> ${quantia} StarCoins**\n\n**:cry: Ehh... ${perdedor}, quem sabe você tem sorte na proxima!**`, components: [] })

      } else {
        return interaction.editReply({ content: `${interaction.user}\n**${user.tag} arregou!\nNão quis apostar ${quantia} StarCoins com você**`, components: [] })
      }
    })
  }

}