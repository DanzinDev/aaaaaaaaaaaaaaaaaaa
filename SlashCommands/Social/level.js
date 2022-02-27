const Discord = require("discord.js");
var admin = require("firebase-admin");
let database = admin.database();
module.exports = {
    name: "level",
    description: "[Social] - Veja seu level",
    options: [{
        name: "user",
        description: "mencionar um usuário",
        type: "USER",
        required: false
    }, ],
  run: async (client, interaction, guild) => {
const user = interaction.options.getUser('user') || interaction.user;

let levelDir = `guild/${guild.id}/user/${user.id}/levels`

  let levels = await database.ref(levelDir).once('value')
  levels = levels.val()

        const Response = new Discord.MessageEmbed()
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription(`**Level atual: ${levels.level || 0}!\nPróximo Level: ${levels.level+1 || 1}\nXP atual: (${levels.xp || 0}/${(levels.level || 0)*100})**\n**Falta mais: ${(levels.level || 0)*100 - levels.xp || 0}XP para upar de level!**`)
    .setColor("ORANGE")
        interaction.reply({ embeds: [Response] })
    }
}