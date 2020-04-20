const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const executeArgs = {
    messageArgs: [],
    available: [],
    busy: []
}

fs.readFile('./data/usuarios.json', 'utf8', (err, jsonString) => {
    if (err) {
        return
    }
    const data = JSON.parse(jsonString);
    executeArgs.available = data.availableUsers;
    executeArgs.busy = data.busyUsers;
    
});

client.login(config.token);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', (msg) => {

    if (msg.content.includes('#criar_pull_request')) {
        let subMessage = msg.content.substring(msg.content.indexOf('#criar_pull_request'));
        let messageArgs = subMessage.split(/ +/);
        executeArgs.messageArgs = messageArgs;
        client.commands.get('criar_pull_request').execute(msg, executeArgs);

    } else if (msg.content.includes("#merge_pull_request")) {
        let subMessage = msg.content.substring(msg.content.indexOf('#merge_pull_request'));
        let messageArgs = subMessage.split(/ +/);
        executeArgs.messageArgs = messageArgs;
        client.commands.get('merge_pull_request').execute(msg, executeArgs);

    } else if (msg.content.includes('#revisores_disponiveis')) {
        client.commands.get('revisores_disponiveis').execute(msg, executeArgs);
    } else if (msg.content.includes('#revisores_ocupados')) {
        client.commands.get('revisores_ocupados').execute(msg, executeArgs);
    }

})