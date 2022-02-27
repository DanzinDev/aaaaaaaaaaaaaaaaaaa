const client = require('../../foxy.js');
const admin = require("firebase-admin");
const database = admin.database();
client.on('guildMemberRemove', async guildMember => {

  if (true) return

  let canalId = await database.ref(`guild/${guildMember.guild.id}/settings/bye/channel`).once('value')
  canalId = canalId.val()
  var canal = client.channels.cache.get(canalId)
  
  let titulo = await database.ref(`guild/${guildMember.guild.id}/settings/bye/title`).once('value')
  titulo = titulo.val()

  let mensagem = await database.ref(`guild/${guildMember.guild.id}/settings/bye/message`).once('value')
  mensagem = mensagem.val()

  if(!canal) return;

  try {
    require('../../Utils/guildmember.js').messageMemberLog(guildMember, canal, titulo, mensagem, "GREEN")
  } catch (e) {
    canal.send(guildMember + "**Saiu do servidor, porem devido a um erro, eu não consegui enviar a mensagem configurada!**")
  }
})