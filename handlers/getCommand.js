module.exports = client => commandName => {

    const hasCommand = client.commands.has(commandName) || client.aliases.has(commandName)

    return hasCommand ? client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName)) : null

}