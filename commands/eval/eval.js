module.exports.name = "eval"


module.exports.run = async (client, message, args) => {
    const { inspect } = require('util')
    const { success, unsuccess, successWithInput } = require("./config.js").embeds

    if (message.author.id !== "474407357649256448") return

    let input = args.join(" ")

    if (!input) return message.channel.send('Provide a input, your bastard 🤦‍♂️')

    try {

        if (input.startsWith("```js")) input = input.slice(5, input.length - 3)

        let output = await eval(input)

        if (typeof output !== "string") output = inspect(output)

        if (output.length > 1900) output = output.substr(0, 1900)

        const emojis = {
            '🌈': "🌈 Para visualizar o input!",
            '💥': "💥 Para remover este eval!"
        }

        const emojisKey = Object.keys(emojis)

        const msg = await message.channel.send(
            success(output, emojisKey.reduce((acc, cur) => acc + emojis[cur], '')
            ))

        for (const emoji of emojisKey) await msg.react(emoji)

        const filter = (reaction, user) => reaction.me && user.id === message.author.id

        const options = { time: 60000, max: 2 }

        msg.createReactionCollector(filter, options)
            .on("collect", async reaction => {
                await reaction.remove()
                reaction.emoji.name == emojisKey[0] ? msg.edit(successWithInput(input, output)) : msg.delete()
            })

    } catch (error) {
        message.channel.send(unsuccess(error.message))
    }

}