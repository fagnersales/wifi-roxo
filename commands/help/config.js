const { MessageEmbed } = require("discord.js")


module.exports = (client) => {
    const p = process.env.PREFIX

    const commandsHelp = () => {
        const res = []

        for (const key of client.commands.keys()) res.push(key)

        get = (key) => client.commands.get(key)

        const mapCommands = key => `> **${p}${key}** [${get(key).aliases.map(a => `\`${a}\``).join(', ')}]
        _${get(key).help.simpleDesc}_
        ~> ${get(key).help.example || "Não há um exemplo pronto para isto."}`

        return res.filter(key => get(key).help).map(mapCommands)

    }

    function mainEmbed() {
        return new MessageEmbed()
            .setTitle(`Precisando de uma ajudinha? 😘`)
            .setColor('#ff80c8')
            .setDescription(`Não esqueça que você pode utilizar \`\`${p}ajuda + NomeDoComando\`\`
para informações mais detalhadas!
        
> **${p}NomeDoComando** [\`Outras\`, \`Formas\`, \`De\`, \`Uso\`]
_Descrição simples sobre o comando_
~> Exemplo de uso 

${commandsHelp().join("\n\n")}`)
    }

    function commandEmbed(command) {
        
    }

    return { mainEmbed, commandEmbed }
}
