const Discord = require("discord.js")
const settings = require("../../settings.json")
var admin = require("firebase-admin");
let database = admin.database();
module.exports = {
  name: "manutenção",
  aliases: [],
  run: async (client, message, args) => {
    if (!settings.adm_id.includes(message.author.id)) {
      return message.channel.send(`> Apenas meus desenvolvedores podem utilizar esse comando!`)
    }

    let opcao = args[0]
    let motivo = args[1] || `Sem motivo...`

    if (!opcao) return message.channel.send(`${message.author}\n**Você precisa dizer se quer ativar ou desativar a manutenção**`)

    if (opcao == "ativar") {
      message.channel.send(`${message.author}\n**:construction_worker::tools: Manutenção ativada com sucesso**`)
      client.channels.cache.get("923613164246011924").send(`:construction_worker::tools: MANUTENÇÃO ATIVADA\nMotivo da manunteção: ${motivo}`)
      database.ref(`bot/manutenção`).set(true)
      database.ref(`bot/manutenção/reason`).set(motivo)
    }

    if (opcao == "desativar") {
      message.channel.send(`${message.author}\n**:construction_worker::tools: Manutenção desativada com sucesso**`)
      client.channels.cache.get("923613164246011924").send(`:construction_worker::tools: MANUTENÇÃO DESATIVADA\n:partying_face: Aaaee, eu volteiii`)
      database.ref(`bot/manutenção`).set(false)
      database.ref(`bot/manutenção/reason`).set(null)
    }
  }
}