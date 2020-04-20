const fs = require('fs');

module.exports = {
	name: 'criar_pull_request',
	description: 'Este comando informa o pull request que está sendo criado e seus respectivos revisores.',
	execute(msg, args) {
        let sender = msg.member.user.username;
		let prId = args.messageArgs[1];
        if (!prId) {
            msg.channel.send("É necessário informa o id do Pull Request ([criar_pull_request] [idPullRequest] <PR Grande>)");
            return;
        }
        if (args.busy.map(x => x.pullRequestId).includes(prId)) {
            msg.channel.send("Esse id já foi cadastrado e está sendo revisado por: " + args.busy.filter(x => x.pullRequestId === prId).map(x => x.username));
            return;
        }
        let longPR = args.messageArgs[2] == '#pr_grande';
        let members = [];
        msg.guild.members.fetch().then(function (x) {
            let available = args.available.map(y => y.username);
            let users = x.filter(y => y.user.username !== sender && available.includes(`@${y.user.username}`)).map(function (y) { return { userid: `<@${y.user.id}>`, username: `@${y.user.username}`, pullRequestId: prId }; });
            if (users.length > 0) {
                users = shuffle(users);
                members.push(users.shift());
                if (users.length >= 1) {
                    members.push(users.shift());
                    if (longPR && users.length >= 1) {
                        members.push(users.shift());
                    }
                }
                args.busy = args.busy.concat(members);
                args.available = args.available.filter(y => !args.busy.map(el => el.username).includes(y.username));
                msg.channel.send(`Adicionado ao PR${prId ? ' ' + prId : ''}: ${members.map(x => x.userid)}`);
                writeFile(args);
            } else {
                msg.channel.send("Não há revisores disponíveis");
            }
        });
	},
};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

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