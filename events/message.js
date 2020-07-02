const { messages } = require("@fagnersales/cm-js")

module.exports.name = "message"

module.exports.run = (client, database, message) => {

    const guildPrefix = process.env.PREFIX

    let args = message.content.split(" ").slice(1);

    const mentions = [`<@!${client.user.id}>`, `<@${client.user.id}>`]

    const startsWithMentionMe = message.content.startsWith(mentions[0]) || message.content.startsWith(mentions[1])

    const commandName = startsWithMentionMe ? "mention-me" : message.content.split(" ")[0].slice(guildPrefix.length).toLowerCase();
    
    const command = client.commands.has(commandName) || client.aliases.has(commandName)

    if (command) {
        const commandToRun = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName))

        commandToRun.run(client, message, args, database, {
            defaultParams: [command.name, message.author, message.guild],
            send: messages.discordSender(message.channel)
        })   
    }

}