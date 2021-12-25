
var commands = [];

export function parse(message) {
	if (!message.content.startsWith('!')) return;
	for (let command of commands) {
		const content = message.content.substring(1);
		if (command.name == content ||
			command.aliases.includes(content)) {
				console.log(message.member.roles);
			/*if (command.permissions == '@everyone' ||
				console.log(message.member.roles.has(command.permissions)) {
				command.execute(message);
			}
			command.execute(message);*/
		}
	}
}

export function createCommand(command) {
	commands.push(command);
}
