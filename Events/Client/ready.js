const client = require('../../foxy.js');
const Discord = require("discord.js");
client.on('ready', async () => {

  let voltei = new Discord.MessageEmbed()

    .setTitle(`📶 | Reniciando...`)
    .setDescription(`Fui reniciado! Mas eu ja voltei!\n👤•${client.users.cache.size} Usuários!\n💬•${client.channels.cache.size} Canais!\n✨•${client.guilds.cache.size} Servidores!`)
    .setColor("GREEN")    
    .setTimestamp()
    .setThumbnail(client.user.displayAvatarURL())
  client.channels.cache.get("898401903145275414").send({embeds: [voltei]})

  var tabela = [

		{ name: `© foxy`, type: "WATCHING" },
    { name: `Mudando para comandos slash (comandos em /)`, type: "WATCHING" }
  ];
	function setStatus() {
		var altstatus = tabela[Math.floor(Math.random() * tabela.length)];
    client.user.setActivity(altstatus.name, {
			type: altstatus.type
		}); 
	}
	setStatus(); 
	setInterval(() => setStatus(), 1500); 

  console.log(`[READY] ${client.user.tag} foi ligado com sucesso`)
})