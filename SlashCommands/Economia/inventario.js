const Discord = require("discord.js");
const admin = require("firebase-admin");
const database = admin.database();



module.exports = {
  name: 'inventario',
  description: '[Economia] - Veja todos os items que você comprou',
  options: [
    {
      name: "user",
      description: "mencionar um usuário",
      type: "USER",
      required: false
    }
  ],
  run: async (client, interaction, guild) => {
    const user = interaction.options.getUser("user");
    let member;
    if (user) member = interaction.guild.members.cache.get(user.id);
    else member = interaction.member;

    let pescarDir = `user/${member.user.id}/itens/pescar`
    let pescar = await database.ref(pescarDir).once('value')
    pescar = pescar.val() || 0

    let picaretaDir = `user/${member.user.id}/itens/picareta`
    let picareta = await database.ref(picaretaDir).once('value')
    picareta = picareta.val() || 0

    var inventario = new Discord.MessageEmbed()
      .setTitle(`🎒 Inventario de ${member.user.username}!`)
      .setColor('ORANGE')
      .addField(`SEUS ITENS:`, `<:vara_de_pescar:919286250953912421> (${pescar}) Vara de pescar\n<:picareta:851563044140351535> (${picareta}) Picareta`)
      .setTimestamp()

    interaction.reply({ embeds: [inventario] })
  }
}