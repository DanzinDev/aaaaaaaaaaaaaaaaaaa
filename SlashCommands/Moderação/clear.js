const Discord = require("discord.js");
module.exports = {
    name: 'apagar',
    description: '[Moderação] - Limpa o chat',
    permission: 'MANAGE_MESSAGES',
    options: [{
            name: 'amount',
            description: 'Forneça a quantidade de mensagens que deseja excluir',
            type: 'NUMBER',
            required: true
        }
    ],
  run: async (client, interaction, guild) => {

if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
			const embed = new Discord.MessageEmbed()
				.setDescription("Você não tem permissão para limpar mensagens!")
				.setColor(0x000000);
			return interaction.reply({ embeds: [embed] });
		}

		if (!Number.isInteger(Number(interaction.options.get("amount").value))) {
			if (interaction.options.get("amount").value === "all") {
				interaction.channel
					.clone({
						position: interaction.channel.rawPosition,
						reason: "Limpando o histórico de mensagens do canal",
					})
					.then((newChannel) => {
						const embed = new Discord.MessageEmbed()
							.setColor(0x000000)
							.setDescription("Histórico de mensagens do canal apagado!");

						newChannel.send({ embeds: [embed] }).then((sent) => {
							setTimeout(() => {
								sent.delete();
							}, 10000);
						});
					});
				interaction.channel.delete({
					reason: "Limpando o histórico de mensagens do canal",
				});
				return;
			} else {
				const embed = new Discord.MessageEmbed()
					.setColor(0x000000)
					.setDescription("Por favor, insira um número inteiro válido!");
				return interaction.reply({ embeds: [embed] });
			}
		}

		if (Number(interaction.options.get("amount").value) > 100) {
			const embed = new Discord.MessageEmbed()
				.setColor(0x000000)
				.setDescription(
					"Você não pode excluir mais de 100 mensagens de uma vez!"
				);
			return interaction.reply({ embeds: [embed] });
		}

		if (Number(interaction.options.get("amount").value) < 1) {
			const embed = new Discord.MessageEmbed()
				.setColor(0x000000)
				.setDescription("Você deve deletar pelo menos uma mensagem!");
			return interaction.reply({ embeds: [embed] });
		}

		interaction.channel
			.bulkDelete(Number(interaction.options.get("amount").value), true)
			.then(async (collection) => {
				const embed = new Discord.MessageEmbed()
					.setDescription(
						`
                    Apagado com sucesso \`${collection.size}\` mensagens!
                    *Observação: algumas mensagens podem não ter sido apagadas, pois já tinham mais de 14 dias.*
                    `
					)
					.setColor(0x000000);

				interaction.reply({ embeds: [embed] });
			})
			.catch((err) => {
				console.error(err);
				const embed = new Discord.MessageEmbed()
					.setDescription("Ocorreu um erro ao limpar as mensagens.")
					.setColor(0x000000);

				interaction.reply({ embeds: [embed] });

				return;
			});
	},
};