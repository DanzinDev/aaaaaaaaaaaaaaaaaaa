let slash = []
const { readdirSync } = require("fs");
const ascii = require("ascii-table");
let table = new ascii("Slash Commands");
table.setHeading('Slash Command', ' Load status');
module.exports = (client) => {
    readdirSync("./SlashCommands/").forEach(dir => {
        const commands = readdirSync(`./SlashCommands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../SlashCommands/${dir}/${file}`);
            if (pull.name) {
                client.slashcommands.set(pull.name, pull);
                slash.push(pull);
                table.addRow(file, `COMANDO REGISTRADO`);
            } else {
                table.addRow(file, `COMANDO NÃO REGISTRADO`);
                continue;
             }
          }
    });
    console.log(table.toString());
client.on("ready",async ()=> {
    await client.application.commands.set(slash).then(() => {
      console.log("[Sucesso] Comandos registrados!")
    }).catch(err => {
      console.log("Erro ao registrar um comando\n" + err)
    })
 })
}