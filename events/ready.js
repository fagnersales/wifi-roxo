module.exports.name = 'ready'


module.exports.run = (client, database) => {
    console.log(`${client.user.username} Logged!`)
}