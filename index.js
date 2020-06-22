const { join } = require("path")
const { Client, Collection } = require("discord.js")
require('dotenv').config()
const client = new Client()

const commandHandler = require("./handlers/commands")
const eventHandler = require('./handlers/events')

require('./handlers/database')
require('./handlers/messages.js')()

client.commands = new Collection()

commandHandler(client, join(__dirname, 'commands'))
eventHandler(client, join(__dirname, 'events'))

client.login(process.env.TOKEN)

