const Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require("fs")
const param = require('./parametre.json')

let prefix = "/"

const {
    TokenBot
} = require("./config")

bot.on('ready', () => {
    helpEmbed = new Discord.MessageEmbed()
        .setColor('#FFFFFF')
        .setTitle('Help  ')
        .setThumbnail(bot.user.avatarURL())
        .addField(prefix + 'prefix', 'info de la commande', true)
        .addField(prefix + 'commande2', 'info de la commande', true)
        .addField(prefix + 'commande3', 'info de la commande', true)
        .addField('-', 'github : (https://github.com/jujulodace/botDiscordLicenseLaRochelle)', false)
        .setFooter("footer. message en bas quoi..");

})
bot.on("guildCreate", guild => {
    param[guild.id] = {}
    param[guild.id].general = guild.channels.cache.filter(channel => channel.type === "text").first().id;
    param[guild.id].prefix = "/"
    guild.channels.cache.get(param[guild.id].general).send("le channel par default du bot est celui ci, le préfix par default du bot est /. pour voir les commandes disponibles, écrire prefix + help, donc actuellement /help")
    fs.writeFileSync("parametre.json", JSON.stringify(param))
});

bot.on('message', (message) => {
    mes = message.content.split(" ");
    mes[0] = mes[0].toLowerCase()
    try {
        if (mes[0][0] === prefix) {
            switch (message[0].substring(1)) {
                case "help":
                    help(message)
                    break;
                case "default":
                    setGeneral(message.channel.id)
                    break;
                case "prefix":
                    setPrefix(message)
                    break;
                case "add":
                    help(message)
                    break;
                default:
                    break;
            }
        }
    } catch (error) {
        message.channel.send("une erreur est inatendu est survenue" + "```" + error + "```")
    }
})
const help = (message) => message.channel.send(helpEmbed)
const setGeneral = (channel) => param[channel.guild.id].general = channel
const setPrefix = (message) => param[message.guild.id].prefix = message.content[0]

bot.login(TokenBot);