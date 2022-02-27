const admin = require("firebase-admin");
const database = admin.database();
const Discord = require("discord.js")

module.exports = async (client, message) => {  

  let levelDir = `guild/${message.guild.id}/user/${message.author.id}/levels/level`
  let xpDir = `guild/${message.guild.id}/user/${message.author.id}/levels/xp`
  
  let level = await database.ref(levelDir).once('value')
  let xp = await database.ref(xpDir).once('value')
  level = level.val()
  xp = xp.val()

  if (!level && !xp) {
    await database.ref(levelDir).set(0)
    await database.ref(xpDir).set(1)
    return
  }

  let gerarXP = Math.floor(Math.random() * 5 - 1) + 1;

  await database.ref(xpDir).set(xp + gerarXP)
 
  if (level*100 <= xp) {
    await database.ref(levelDir).set(level + 1)
    await database.ref(xpDir).set(1)

    let channel = await database.ref(`guild/${message.guild.id}/settings/levelchannel`).once('value')

    channel = channel.val()

    var canal = client.channels.cache.get(channel)
    if (!canal) return

    let embed = new Discord.MessageEmbed()
    .setColor(`RANDOM`)
    .setDescription(`🥳 ${message.author}\n・Parabéns! Você passou para o level: ${level+1}`)

    canal.send({embeds : [embed]}) 

  }
          
}