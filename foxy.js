const { Client, Collection, MessageEmbed } = require('discord.js');
const fs = require('fs')
const { GiveawaysManager } = require('discord-giveaways');
const client = new Client({
    intents: 32767
});
const database = require("./Utils/firebase")()
require('./Utils/website.js')()

client.events = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./Commands");
client.slashcommands = new Collection();

module.exports = client;

["events", "slashcommands", "commands"].forEach(handler => {
  require(`./Structures/${handler}`)(client);
});

client.login(process.env.TOKEN);