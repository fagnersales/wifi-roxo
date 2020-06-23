const { messages } = require("@fagnersales/cm-js")

module.exports.name = "message"

module.exports.run = (client, database, message) => {

    const guildPrefix = process.env.PREFIX

    let command;
    let args = message.content.split(" ").slice(1);
    let commandName = message.content.split(" ")[0].slice(guildPrefix.length).toLowerCase();

    if (client.commands.has(commandName)) command = client.commands.get(commandName);
    else return;

    command.run(client, message, args, database, {
        defaultParams: [command.name, message.author, message.guild],
        send: messages.discordSender(message.channel)
    })   
}