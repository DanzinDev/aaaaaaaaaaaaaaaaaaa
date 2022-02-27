let Discord = require("discord.js");
let math = require("math-expression-evaluator");
module.exports = {
  name: 'calc',
  description: '[Informativo] - Me manda uma conta de matematica pra eu resolver',
  options: [
    {
      name: "calculo",
      description: "Diga um calculo para eu resolver",
      type: "STRING",
      required: true
    }
  ],

  run: async (client, interaction, guild) => {
    const calculo = interaction.options.getString("calculo");
    let resultado;
    try {
      resultado = math.eval(calculo);
    } catch (e) {
      resultado = `Eu acho que faltei algumas aulas de matematica por que eu não to conseguindo resolver esse calculo :( **Desculpa**`;
    }
    interaction.reply(`**🧮 Cálculo:** ${calculo}\n**✅ Resultado:** ${resultado}`);
  }
}
