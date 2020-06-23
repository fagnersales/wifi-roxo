const generateID = (len = 10, id = "") => id.length < len ? generateID(len, id += Math.floor(Math.random() * 9)) : id 

module.exports = generateID