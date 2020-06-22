const { messages } = require("@fagnersales/cm-js")

module.exports = () => {
    const jsonMessages = require('./messages.json')

    messages.add(jsonMessages)
}