let Discord = require("discord.js");
const translate = require("@vitalets/google-translate-api");
const fs = require("fs")
module.exports = {
  name: 'traduzir',
  description: '[Informativo] - Irei traduzir alguma mensagem que você dizer',
  options: [
    {
      name: "lingua",
      description: "Diga um lingua para eu traduzir",
      type: "STRING",
      required: true
    },
    {
      name: "texto",
      description: "Diga um texto para eu traduzir",
      type: "STRING",
      required: true
    }
  ],

  run: async (client, interaction, guild) => {
    const lingua = interaction.options.getString("lingua");
    const texto = interaction.options.getString("texto");
    try {
      let res = await translate(texto, { to: lingua })

      interaction.reply(`**<a:mensagem:852641393406771200> Mensagem:**\`\`\`${texto}\`\`\`**<:tradutor:851576367882960896> Tradução:**\`\`\`${res.text}\`\`\``);

    } catch (err) {
      interaction.reply(`**:x: Ocorreu um erro ao traduzir!\nEssa linguagem (${lingua}) não existe!**`)
    }
  }
}
