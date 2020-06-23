const generateID = require('../methods/generateID')
const { ReactionEmoji } = require('discord.js')

module.exports.name = "message"

module.exports.run = async (client, database, message) => {
    const refForChannel = "gallery/channel"

    const channelID = (await database.ref(refForChannel).once("value")).val()

    const validInput = message.channel.id == channelID && message.attachments.first()

    const emojis = ["📝", "✨"]

    const saveOnDatabase = async (comment = "") => {
        const galleryPostsRef = database.ref("gallery/posts")

        const galleryPosts = (await galleryPostsRef.once("value")).val() || []

        const newPost = {
            author: message.author.id,
            postedAt: message.createdTimestamp,
            url: message.attachments.first().url,
            comment: comment,
            id: generateID(28, message.author.id),
            likes: 0,
            likedBy: []
        }

        galleryPostsRef.set([...galleryPosts, newPost])

    }


    if (validInput) {

        for (const emoji of emojis) await message.react(emoji)

        const msg = await message.channel.send(`${message.member} Reaja com 📝 para adicionar um comentário e salvar ou ✨ para salvar sem um comentário!\nIgnore para cancelar`)

        const commentAndSave = async () => {
            await msg.edit(`${message.member} Envie o comentário a ser adicionado! (Máximo de 256 caracteres!)`)

            const messageFilter = m => m.author.id === message.author.id && m.content.length <= 256

            const collect = async (collected) => {
                await msg.edit(`${message.member} Sua foto foi salva com sucesso!`)
                message.reactions.cache.filter(r => r.me).forEach(reaction => reaction.remove())
                msg.delete({ timeout: 7000 })

                saveOnDatabase(collected.content)
            }

            message.channel.createMessageCollector(messageFilter, { time: 180000, max: 1 }).on("collect", collect)
        }

        const filter = (r, u) => r.me && u.id === message.author.id

        message.createReactionCollector(filter, { time: 60000, max: 1 })
            .on("collect", reaction => {
                if (reaction.emoji.name == emojis[0]) return commentAndSave()

                message.reactions.cache.filter(r => r.me).forEach(reaction => reaction.remove())
                msg.delete().catch(() => { })
                saveOnDatabase()
            })
            .on("end", (data, reason) => {
                if (reason == "time") {
                    message.reactions.cache.filter(r => r.me).forEach(reaction => reaction.remove())
                    msg.delete().catch(() => { })
                }
            })


    }




}