const { MessageEmbed } = require("discord.js")
const { once } = require('events')

const moment = require('moment')
moment.locale('pt-br')

module.exports = {
    name: "gallery",
    aliases: ['galeria', 'g'],
    help: {
        simpleDesc: `Veja sua galeria ou mencione alguém para ver a dela`
    }
}

module.exports.run = async(client, message, args, database) => {

    const member = message.mentions.members.first() || message.member

    const galleryPostsRef = database.ref("gallery/posts")

    const getGalleryPosts = async(member) =>
        member ? (await galleryPostsRef.once("value")).val().filter(x => x.author == member.id) :
        (await galleryPostsRef.once("value")).val()

    const galleryPosts = await getGalleryPosts()

    if (galleryPosts == null) return message.channel.send(`Ninguém tem uma galeria pública ainda!`)

    const memberGallery = galleryPosts.filter(x => x.author == member.id)

    if (memberGallery.length == 0) return message.channel.send(`${member} não tem uma galeria ainda ;(`)


    sortWay()

    async function sortWay() {
        const emojis = {
            '❤': 'loves',
            '✨': 'recent',
            '👻': 'old'
        }

        const text = Object.keys(emojis).map(emoji => `${emoji} - ${emojis[emoji]}`).join('\n')

        const msg = await message.channel.send(`Escolha como você quer ordenar:\n${text}`)

        const filter = (r, u) => r.me && u.id === message.author.id

        const options = { time: 15000, max: 1 }

        for (const emoji of Object.keys(emojis)) await msg.react(emoji)

        const collector = msg.createReactionCollector(filter, options)

        const [collected, reason] = await once(collector, 'end')

        if (reason == "limit") {
            msg.delete()
            visualizeGallery(emojis[collected.first().emoji.name])
        }

    }

    async function visualizeGallery(type, page = 0, messageUsed) {

        let sort, text

        if (type == "recent") {
            text = 'Filtrando pelas mais recentes'
            sort = (a, b) => b.postedAt - a.postedAt
        } else if (type == "old") {
            text = 'Filtrando pelas mais antigas'
            sort = (a, b) => a.postedAt - b.postedAt
        } else if (type == "loves") {
            text = 'Filtrando pelas mais curtidas'
            sort = (a, b) => b.loves - a.loves
        }

        const gallery = (await getGalleryPosts(member)).sort(sort)

        const buttons = ["❤", "◀", "▶"]

        const pageByButton = (button) => {
            if (button === buttons[1]) {
                if (page == 0) return gallery.length - 1
                else return page - 1
            } else if (button === buttons[2]) {
                if (page == gallery.length - 1) return 0
                else return page + 1
            }
        }

        const nowImage = gallery[page]

        const embed = new MessageEmbed()
            .setImage(nowImage.url)
            .setDescription(`(${page + 1}/${gallery.length}) | ${text}`)
            .setTitle(nowImage.comment)
            .setColor('#ff80c8')
            .setFooter(`❤ ${nowImage.loves} | Postada ${moment(nowImage.postedAt).fromNow()}`)

        const msg = messageUsed || await message.channel.send(embed)

        for (const button of buttons) await msg.react(button)

        loveImage(nowImage.id, msg)

        const filter = (r, u) => buttons.slice(1).includes(r.emoji.name) && u.id === message.author.id

        msg.createReactionCollector(filter, { time: 60000, max: 1 })
            .on("collect", reaction => visualizeGallery(type, pageByButton(reaction.emoji.name)))

        .on("end", (a, reason) => {
            if (reason == "limit" || reason == "time") msg.delete()
        })
    }

    function loveImage(imageID, msg) {
        msg.createReactionCollector(reaction => reaction.emoji.name == "❤", { time: 60000 })
            .on("collect", async(reaction, user) => {

                const image = (await getGalleryPosts(member)).find(x => x.id == imageID)

                image.lovedBy = image.lovedBy || []

                if (image.lovedBy.includes(user.id)) return reaction.users.remove(user.id)

                image.lovedBy.push(user.id)
                image.loves = image.lovedBy.length

                const updateGallery = memberGallery.map(img => img.id === image.id ? image : img)

                galleryPostsRef.set(updateGallery)

                msg.edit(new MessageEmbed(msg.embeds[0]).setFooter(`❤ ${image.loves} | Postada ${moment(image.postedAt).fromNow()}`))
            })
    }
}