const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const executeArgs = {
    messageArgs: [],
    available: [],
    busy: [],
    all: [],
    sender: ""
}

fs.readFile('./data/usuarios.json', 'utf8', (err, jsonString) => {
    if (err) {
        return
    }
    const data = JSON.parse(jsonString);
    executeArgs.available = data.availableUsers;
    executeArgs.busy = data.busyUsers;
    executeArgs.all = executeArgs.available.concat(executeArgs.busy);
    
});

client.login(config.token);

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () =>{
    console.log("The bot is running.");
})

client.on('message', (msg) => {

    if (msg.content.includes('Novo pull request foi criado para aprovação')) { // #criar_pull_request
        let subMessage = msg.content.substring(msg.content.indexOf('Novo pull request foi criado para aprovação'));
        let messageArgs = subMessage.split(" - ");
        executeArgs.messageArgs = messageArgs;
        let prCreator = msg.embeds[0].fields[0].value;
        executeArgs.sender = executeArgs.all.find(x => prCreator == x.fullname);
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