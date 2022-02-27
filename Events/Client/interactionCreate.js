const client = require('../../foxy.js');
client.on("interactionCreate", async(interaction) => {
  if(interaction.isCommand()) {

    const cmd = client.slashcommands.get(interaction.commandName);
    if(!cmd) return interaction.followUp({
      content: "Um erro ocorreu!"
    });
    const guild =  client.guilds.cache.get(interaction.guildId);

    let subCommand = undefined;
    for (let option of interaction.options.data) {
      if (option.type == "SUB_COMMAND") {
        subCommand = option
        break;
      }
    }
    interaction.member = interaction.guild.members.cache.get(interaction.user.id);
    cmd.run(client, interaction, guild, subCommand).catch(err => {
      console.log("Um erro ocorreu ao executar um comando slash\n" + err)
    })
  }
})