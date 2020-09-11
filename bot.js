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
            switch (message.content.substring(1)) {
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

                    addchannel(message.author.id, message.guild)
                    break;
                default:
                    break;
            }
        }
    } catch (error) {
        message.channel.send("une erreur est inatendu est survenue" + "```" + error + "```")
    }
})

bot.on('voiceStateUpdate', (oldState, newState) => {
    let channelJoin = newState.channel
    let channelLeave = oldState.channel
    if (channelJoin !== null) {
        var vide = 0;
        for (var channel in param[oldState.guild.id].channels) {
            if (param[oldState.guild.id].channels[channel] != null && param[oldState.guild.id].channels[channel].id.indexOf(channelJoin.id) != -1) {
                channelSubber = param[oldState.guild.id].channels[channel].id[0]
                for (var i = 0; i < param[oldState.guild.id].channels[channel].id.length - 1; i++) {
                    if (channelJoin.guild.channels.cache.get(param[oldState.guild.id].channels[channel].id[i]).members.first(1)[0] == undefined) {
                        vide++;
                    }
                }
                if (vide == 0) {
                    makeSubChannel(channelJoin.name, channelJoin.parentID, channel, channelJoin.guild)
                }
            }
        }
    }
    if (channelLeave !== null) {
        for (var channel in param[oldState.guild.id].channels) {
            if (param[oldState.guild.id].channels[channel] != null && param[oldState.guild.id].channels[channel].id.indexOf(channelLeave.id) != -1) {
                if (param[oldState.guild.id].channels[channel].id.length >= 2 && channelLeave.guild.channels.cache.get(channelLeave.id).members.first(1)[0] == undefined) {
                    channelLeave.guild.channels.cache.get(channelLeave.id).delete()
                    param[oldState.guild.id].channels[channel].id.splice(param[oldState.guild.id].channels[channel].id.indexOf(channelLeave.id), 1)
                    fs.writeFileSync("parametre.json", JSON.stringify(param))
                    if (param[oldState.guild.id].channels[channel].id.length == 1 && channelJoin != null && channelJoin.name == channelLeave.name)
                        makeSubChannel(channelLeave.name, channelLeave.parentID, channel, channelLeave.guild)
                }
            }
        }
    }
})
const help = (message) => message.channel.send(helpEmbed)
const setGeneral = (channel) => param[channel.guild.id].general = channel
const setPrefix = (message) => param[message.guild.id].prefix = message.content[0]

const addchannel = (author, serveur) => {
    serveur.channels.cache.forEach(element => {
        if (element.type == "voice" && element.members.get(author) != null) {
            var exist = 0
            for (var channel in param[serveur.id].channels) {
                if (param[serveur.id].channels[channel] != null && param[serveur.id].channels[channel].id.indexOf(element.id) != -1)
                    exist = 1
            }
            if (exist == 0) {
                param[serveur.id].channels[element.id] = {}
                param[serveur.id].channels[element.id].id = [element.id]
                param[serveur.id].channels[element.id].name = element.name
                param[serveur.id].channels[element.id].userLimit = element.userLimit
                makeSubChannel(element.name, element.parentID, element.id, serveur)
                serveur.channels.cache.get(param[serveur.id].general).send("channel add")
            }
        }
    });
}
const makeSubChannel = (name, parent, groupeSubber, serveur) => {
    console.log(groupeSubber)
    serveur.channels.create(name, { type: "voice" })
        .then(async channel => {
            if (parent)
                await channel.setParent(serveur.channels.cache.get(parent))

            await param[serveur.id].channels[groupeSubber].id.push(channel.id)
            let position = 10000;
            console.log(param[serveur.id].channels[groupeSubber])
            for (var i = 0; i < param[serveur.id].channels[groupeSubber].id.length - 1; i++) {

                if (serveur.channels.cache.get(param[serveur.id].channels[groupeSubber].id[i]).position < position) {
                    position = serveur.channels.cache.get(param[serveur.id].channels[groupeSubber].id[i]).position
                    console.log(position)
                }
            }
            await channel.setUserLimit(param[serveur.id].channels[groupeSubber].userLimit)
            await fs.writeFileSync("parametre.json", JSON.stringify(param))
            await channel.setPosition(position)
        })
        .catch(console.error);
}

bot.login(TokenBot);