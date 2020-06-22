module.exports.name = "test"

const { messages } = require("@fagnersales/cm-js")

module.exports.run = (client, message, args, database) => {
    messages.add('oi', 'ola')

    const msg = messages.get('oi')
    message.channel.send(msg)
}