const Discord = require('discord.js');
const client = new Discord.Client({ disableMentions: 'everyone' });

const config = require('./botsettings.json');


const fs = require('fs')

client.commands = new Discord.Collection();
 


 // status reader 
const status = require('./events/status')
status(client);
console.log('status working')



//command exporter
fs.readdir('./commands/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Loading command ${commandName}`);
        client.commands.set(commandName, props);
    });
});





//guildonly permissions prefix  aliases usage executuing erroe
client.on('message', message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;


	const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
    		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
      if (!command) return;
    
    if (command.guildOnly && message.channel.type === 'dm') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (command.permissions) {
         	const authorPerms = message.channel.permissionsFor(message.client.user);
         	if (!authorPerms || !authorPerms.has(command.permissions)) {
         		return message.channel.reply('You can not do this! You Don\'t Have Enough Permissions');
         	}
         }
         if (command.args) {
            let reply = `You didn't provide any arguments, ${message.author}!`;
            
            		if (command.usage) {
            			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            		}
            
             	return message.channel.send(reply);
                }
            
             
    try {
        command.run(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command! Please try again later.');
    }
});





client.login(config.token)

;