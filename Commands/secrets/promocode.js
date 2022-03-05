const Discord = require("discord.js")
const settings = require("../../settings.json")
var admin = require("firebase-admin");
let database = admin.database();
module.exports = {
  name: "promocode",
  aliases: [],
  run: async (client, message, args) => {
 let promocodeDir = `bot/promocodes`

  if(!settings.adm_id.includes(message.author.id)) {
    return message.channel.send(`> Apenas meus desenvolvedores podem utilizar esse comando!`)
  }
  
  message.delete()

  let opcao = args[0]
  let name = args[1]

  if (!opcao) return message.channel.send(`${message.author}\n**Você precisa dizer se quer adicionar(add) ou remover(remove) um promocode**`)

  if (opcao == "add") {
    let valor = args[2]
    if (!name) return message.channel.send(`${message.author}\n**Coloque um nome desse promocode!**`)

    if (!valor) return message.channel.send(`${message.author}\n**Coloque a quantia de StarCoins que esse promocode vai dar!**`)
    
    if (isNaN(valor)) return message.channel.send(`${message.author}\n**A quantia desse promocode precisa ser um numero!**`)

    if (parseInt(valor) <= 0) return message.channel.send(`**A quantia desse promocode precisa ser maior que 0!**`)
    
    let nameB = await database.ref(promocodeDir + "/"+name).once('value')
    nameB = nameB.val()
    if (nameB) return message.channel.send(`${message.author}\n**Ei, esse promocode ja existe!**`)

    await database.ref(promocodeDir + "/"+name).set([Number(valor), [0], true])

    return message.channel.send(`${message.author}\n**:white_check_mark: O Promocode foi adicionado com sucesso**`)

  }
  //FOXINN ESTEVE AQ
  //SERÁ?
  //SERÁ MESMO?

  if (opcao == "remove") {
    if (!name) return message.channel.send(`${message.author}\n**Coloque um nome para o promocode!**`)
    let nameB = await database.ref(promocodeDir + "/"+name).once('value')
    nameB = nameB.val()

    if (!nameB) return message.channel.send(`${message.author}\n**Esse promocode não existe!**`)

    if (!nameB[2]) return message.channel.send(`${message.author}\n**Esse promocode ja existiu, mas não existe mais!**`)

    message.channel.send(`${message.author}\n**Você tem certeza que deseja deletar esse promocode?**`).then(async msg => {
      msg.react("✅"); // Reaji com o emoji de confimação

      let collect_autor = (reaction, reactor) => reaction.emoji.name === "✅" && reactor.id === message.author.id; 

      let accept_autor = msg.createReactionCollector(collect_autor)
      .on("collect", async r => {
        await database.ref(promocodeDir + "/"+name).set([nameB[0], nameB[1], false])
        msg.delete()
        return message.channel.send(`${message.author}\n**:white_check_mark: O Promocode foi removido com sucesso**`)
      })
    })
  }
}
}