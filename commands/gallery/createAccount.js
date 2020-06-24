const { MessageEmbed } = require("discord.js")

module.exports.name = "account"

module.exports.run = async (client, message, args, database) => {

    const ref = database.reF(`accounts/${message.author.id}`)

    const userAccount = (await ref.once("value")).val() 

    if (userAccount == null) return message.channel.send('você não tem uma conta criada ainda.')

    
   
}