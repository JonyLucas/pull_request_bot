module.exports = {
	name: 'revisores_disponiveis',
	description: 'Informa uma lista de revisores que não estão revisando algum pull request.',
	execute(msg, args) {
        if (args.available.length > 0) {
            msg.channel.send(args.available.map(x => x.username));
        } else {
            msg.channel.send("No momento, não há revisores disponíveis");
        }
	},
};
