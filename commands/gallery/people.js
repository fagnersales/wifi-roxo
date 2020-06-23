const { MessageEmbed } = require("discord.js")

module.exports.name = "gallery"

module.exports.run = async (client, message, args, database) => {

    const member = message.mentions.members.first() || message.member

    const galleryPostsRef = database.ref("gallery/posts")

    const getGalleryPosts = async (member) => 
    member ? (await galleryPostsRef.once("value")).val().filter(x => x.author == member.id) : 
    (await galleryPostsRef.once("value")).val()

    const galleryPosts = await getGalleryPosts()

    if (galleryPosts == null) return message.channel.send(`Ninguém tem uma galeria pública ainda!`)

    const memberGallery = galleryPosts.filter(x => x.author == member.id)

    if (memberGallery.length == 0) return message.channel.send(`${member} não tem uma galeria ainda ;(`)

    visualizeGallery()

    async function visualizeGallery(page = 0) {

        console.log(page)

        const gallery = await getGalleryPosts(message.member)

        const buttons = ["👍", "◀", "▶"]

        const pageByButton = (button) => {
            if (button === buttons[1]) {
                if (page == 0) return gallery.length - 1
                else return page - 1
            } else if (button === buttons[2]){
                if (page == gallery.length - 1) return 0
                else return page + 1
            }
        }

        const nowImage = gallery[page]

        const embed = new MessageEmbed()
            .setImage(nowImage.url)
            .setDescription(`(${page+1}/${gallery.length})`)
            .setTitle(nowImage.comment)
            .setColor('RANDOM')
            .setFooter(`👍 ${nowImage.likes}`)

        const msg = await message.channel.send(embed)

        for (const button of buttons) await msg.react(button)

        likeImage(nowImage.id, msg)

        const filter = (r, u) => buttons.slice(1).includes(r.emoji.name) && u.id === message.author.id

        msg.createReactionCollector(filter, { time: 60000, max: 1 })
        .on("collect", reaction => visualizeGallery(pageByButton(reaction.emoji.name)))

        .on("end", (a, reason) => {
            if (reason == "limit" || reason == "time") msg.delete()
        })
    }

    function likeImage(imageID, msg) {
        msg.createReactionCollector(reaction => reaction.emoji.name == "👍", { time: 60000, })
        .on("collect", async (reaction, user) => {

            const image = (await getGalleryPosts(member)).find(x => x.id == imageID)

            image.likedBy = image.likedBy || []

            if (image.likedBy.includes(user.id)) return reaction.users.remove(user.id)

            image.likedBy.push(user.id)
            image.likes = image.likedBy.length

            const updateGallery = memberGallery.map(img => img.id === image.id ? image : img)

            galleryPostsRef.set(updateGallery)

            msg.edit(new MessageEmbed(msg.embeds[0]).setFooter(`👍 ${image.likes}`))
        })
    }
}