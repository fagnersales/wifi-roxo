module.exports = {
    name: "gchannel",
    aliases: ['gcanal'],
    help: {
        simpleDesc: `Configurar/Ver canal de galeria`,
        fullDesc: `Visualize o canal para galeria xD`
    }
}

const configurateChannel = require('../../methods/configurateChannel')

module.exports.run = async (client, message, args, database, { send }) => {

    const {
        checkChannel,
        editChannel,
        removeChannel,
        saveChannel 
    } = await configurateChannel(database.ref("gallery/channel"), send)


    if (!args[0]) return checkChannel(message)

    if (["edit", "editar"].includes(args[0].toLowerCase())) return editChannel(message, args)

    if (["remove", "remover"].includes(args[0].toLowerCase())) return removeChannel()

    if (["set", "setar", "add", "adicionar"].includes(args[0].toLowerCase())) return saveChannel(message, args)

}