const configurateChannel = async (ref, send) => {
    const messageKey = module.parent.filename.split('\\').reverse().slice(0, 2).reverse().join('/').replace('.js', '')
    const channelID = (await ref.once("value")).val()

    return {
        removeChannel() {
            if (channelID == null) return send(messageKey + "/RemoveChannelButNull")

            ref.set(null)

            return send(messageKey + "/Removed")
        },
        checkChannel(message) {
            const channel = message.guild.channels.cache.get(channelID)
    
            return channel == null ? send(messageKey + "/NotFound") : send(messageKey + "/Found", String(channel))
        },
        editChannel(message, args) {
            if (!args[1]) send(messageKey + "/ProvideNewChannel")
    
            const newChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
    
            if (!newChannel) return send(messageKey + "/NewChannelNotFound")
    
            if (newChannel.id === channelID) return send(messageKey + "/AlreadySaved") 
        
            ref.set(newChannel.id)
    
            return send(messageKey + "/SuccessfullyEdited", String(newChannel))
        },
        saveChannel(message, args) {
            if (!args[1]) return send(messageKey + "/ProvideNewChannel")

            const newChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1])
    
            if (!newChannel) return send(messageKey + "/NewChannelNotFound")
    
            if (newChannel.id === channelID) return send(messageKey + "/AlreadySaved")
    
            ref.set(newChannel.id)
    
            return send(messageKey + "/SuccessfullySaved", String(newChannel))
        }
    }

}

module.exports = configurateChannel