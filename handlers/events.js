const { join } = require('path')
const { readdirSync, lstatSync } = require('fs')
const { database } = require('firebase')

const eventHandler = (client, path = join(__dirname, "..", "discord", "events")) => {

    const files = readdirSync(path)
    if (!files) return console.log(`[EVENTS] => Nenhum arquivo ou diretório encontrado no caminho ${path}`)

    const validateFile = (filePath) => require(filePath) ? require(filePath).name ? true : false : false

    const isConfigurationFile = (filePath) => filePath.split('\\').reverse()[0].startsWith("config") 

    const requireFile = (filePath) => {
        
        if (isConfigurationFile(filePath)) return console.log(`[EVENTS] => Este é um arquivo de configuração`)

        if (!validateFile(filePath)) return console.log(`[EVENTS/ERROR] => Arquivo sem informações ${filePath}`)

        const event = require(filePath)
        if (event && event.name && event.run) {
            console.log(`[EVENTS] => Arquivo sendo carregado ${filePath} `)
            client.on(event.name, event.run.bind(null, client, database()))
        }
    }

    const handleFile = (file) =>
        lstatSync(join(path, file)).isDirectory() ? eventHandler(client, join(path, file)) : requireFile(join(path, file))

    for (const file of files) handleFile(file)

}

module.exports = eventHandler
