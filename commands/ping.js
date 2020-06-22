const { messages } = require("@fagnersales/cm-js")

module.exports.name = 'ping'

module.exports.run = (client, message, args, database) => {

    const send = messages.discordSender(message.channel)

    send("ping/pong")
}