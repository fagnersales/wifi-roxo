const { messages } = require("@fagnersales/cm-js")
const { writeFileSync } = require('fs')
const { join } = require('path')

const byContent = (content, newMessage) => {
    for (const [key, value] of messages.messages.entries()) {
        if (value.toLowerCase() == content.toLowerCase()) {
            const messagesJSON = require('../handlers/messages.json')
            
            messagesJSON[key] = newMessage

            messages.add(messagesJSON)

            writeFileSync(join(__dirname, '..', 'handlers', 'messages.json'), JSON.stringify(messagesJSON, null, 2))

            return true
        }
    }
    return false
}

const byMessage = (message, newMessage) => byContent(message.content, newMessage)

module.exports = {
    byContent,
    byMessage
}