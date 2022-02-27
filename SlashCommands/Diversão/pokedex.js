const Discord = require('discord.js')
const Pokedex = require("pokedex")
const pokedex = new Pokedex()
module.exports = {
    name: 'pokedex',
    description: '[Diversão] - Procure um pokemon',
    options: [
{
            name: 'pokemon',
            description: 'Diga um nome do pokemon',
            type: 'STRING',
            required: true
        }
    ],
  run: async (client, interaction, guild) => {
 const pokemon = interaction.options.getString('pokemon')
let p = pokedex.pokemon(pokemon)
   let pp = p
    if(!p.id) return interaction.reply("❌ Tente não usar números e espaços")
    const embed = new Discord.MessageEmbed()
    .setColor(`#DC143C`)
    .setAuthor({ name: 'Informações do pokémon', iconURL: 'https://cdn.discordapp.com/emojis/646544435043368960.png'})
.addField(`📝 Nome do Pokémon:`, `${pokemon}`)
.addField(`🆔 Número na pokédex:`, `${pp.id}`)
.addField(`↕ Altura:`, `${pp.height}`)
.addField(`↔ Largura:`, `${pp.weight}`)
.addField(`✨ Experiência de Base:`, `${pp.base_experience}`)
    .setThumbnail(pp.sprites.animated)
    interaction.reply({ embeds: [embed] })
      }
}