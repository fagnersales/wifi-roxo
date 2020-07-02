const { messages } = require("@fagnersales/cm-js")
const config = require('./config.js')

module.exports.name = 'help'
module.exports.aliases = ['mention-me', 'ajuda']

module.exports.run = (client, message, args, database, { send }) => {

    const { mainEmbed } = config(client)

    if (!args[0]) return message.channel.send(mainEmbed())

    if (args[0] && !client.getCommand(args[0])) return message.channel.send(`\`${args[0]}\` Não foi reconhecido como um comando! digite ${process.env.PREFIX}ajuda para ver meus comandos :D`)
    
    message.channel.send(`${args[0]} ñ é um comando`)

}