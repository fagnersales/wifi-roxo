const { messages } = require("@fagnersales/cm-js")

const byContent = (content, newMessage) => {
    for (const [a, b] of messages.messages.entries()) {
        console.log("a", a, "b", b)
    }
}

module.exports = {
    byContent
}