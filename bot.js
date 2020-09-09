const Discord = require('discord.js')
const bot = new Discord.Client()

let prefix = "/"

const {
    TokenBot
} = require("./config")

bot.on('ready', function () {

    helpEmbed = new Discord.MessageEmbed()
    .setColor('#FFFFFF')
    .setTitle('Help  ')
    .setThumbnail(bot.user.avatarURL())
    .addField(prefix+'commande1', 'info de la commande', true)
    .addField(prefix+'commande2', 'info de la commande', true)
    .addField(prefix+'commande3', 'info de la commande', true)
    .addField('-', 'github : (https://github.com/jujulodace/botDiscordLicenseLaRochelle)', false)
    .setFooter("footer. message en bas quoi..")
})

bot.on('message', function (message) {
    mes = message.content.split(" ");
    if (mes[0] == prefix + "help") {
        help(message)
    }
})

function help(message) {
    message.channel.send(helpEmbed)
}

bot.login(TokenBot);