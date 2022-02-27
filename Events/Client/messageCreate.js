const client = require('../../foxy.js');
var admin = require("firebase-admin");
let database = admin.database();
client.on('messageCreate', async message => {
  let prefix = "f!"

  if (message.author.bot) return; 
  if(!message.guild) return;
  if(!message.member) message.member = await message.guild.fetchMember(message);

  require("../../Utils/level.js")(client, message);

  if(!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if(cmd.length == 0) return;
  let command = client.commands.get(cmd)
  if(!command) command = client.commands.get(client.aliases.get(cmd));
  if(command) command.run(client, message, args)
})