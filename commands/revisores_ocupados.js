module.exports = {
	name: 'revisores_ocupados',
	description: 'Informa uma lista de revisores que estão revisando um pull request e o id do seu respectivo pull request.',
	execute(msg, args) {
        if (args.busy.length > 0) {
            msg.channel.send(args.busy.map(x => `Usuário: ${x.username} - PR: ${x.pullRequestId}`));
        } else {
            msg.channel.send("No momento, não há revisores ocupados com algum pull request");
        }
	},
};
