const fs = require('fs');

module.exports = {
	name: 'merge_pull_request',
	description: 'Informa que o pull request específico foi mergeado e torna os revisadores deste PR disponíveis para revisão.',
	execute(msg, args) {
        let prId = args.messageArgs[1];
        if (prId) {
            let users = args.busy.filter(x => x.pullRequestId === prId);
            if (users.length > 0) {
                args.available = args.available.concat(users);
                args.busy = args.busy.filter(x => x.pullRequestId !== prId);
                msg.channel.send(`Os usuários ${users.map(x => x.username)} agora estão disponíveis para revisão`);
            } else {
                msg.channel.send("Não há usuários associados ao pull request de id " + prId);
            }

        } else {
            msg.channel.send("É necessário fornecer o Id do pull request ([merge_pull_request] [id_pull_request])");
        }

        writeFile(args)
	},
};

function writeFile(args) {
    const obj = {
        availableUsers: args.available,
        busyUsers: args.busy
    };
    const jsonString = JSON.stringify(obj);
    fs.writeFile('./data/usuarios.json', jsonString, err => {
        if (err) {
            console.log('Error writing file', err);
        } else {
            console.log('Successfully wrote file');
        }
    });
}
