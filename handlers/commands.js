const { readdirSync, lstatSync } = require('fs')
const { join } = require('path')

const commandHandler = (client, path = join(__dirname, "..", "discord", "commands")) => {

    const files = readdirSync(path)
    if (!files) return console.log(`[COMMANDS] => Nenhum arquivo ou diretório encontrado no caminho ${path}`)

    const validateFile = (filePath) => require(filePath) ? require(filePath).name ? true : false : false

    const isConfigurationFile = (filePath) => filePath.split('\\').find(name => name.includes("config")) 

    const requireFile = (filePath) => {
        
        if (isConfigurationFile(filePath)) return console.log(`[COMMANDS] => Este é um arquivo de configuração [${filePath}]`)

        if (!validateFile(filePath)) return console.log(`[COMMANDS/ERROR] => Arquivo sem informações ${filePath}`)

        const command = require(filePath)
        if (command && command.name) {
            console.log(`[COMMANDS] => Arquivo sendo carregado ${filePath} `)
            client.commands.set(command.name, command)
            if (command.aliases) for (const alias of command.aliases) client.commands.set(alias, command)
        }
    }

    const handleFile = (file) =>
        lstatSync(join(path, file)).isDirectory() ? commandHandler(client, join(path, file)) : requireFile(join(path, file))

    for (const file of files) handleFile(file)

}

module.exports = commandHandler
