/**
 * Ajout des dépendances
 */

const Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require("fs")

/**
 * Récupère les paramètre dans un le fichier json
 * param {
 *      guildID : {
 *      general : salonGeneralID,
 *      prefix : prefix,
 *      channels : {
 *          channelAddID : {
 *              id : [tableau des channels du groupe],
 *              name : nomDuGroupe,
 *              userLimit : nombreDuserMax
 *              }
 *          }
 *      }
 * 
 * exemple concret : 
 * 
 * param {
 *      "753282167135797290": {
 *          "general":"753291934935810098",
 *          "prefix":"/",
 *          "channels": {
 *              "753990304335659039":{
 *                  "id":["753994888286306379"],
 *                  "name":"test",
 *                  "userLimit":0 }
 *              }
 *          }
 *      }
 */

const param = require('./parametre.json')

/**
 * Récupère la configuration dut bot(token). Selon la structure suivante : 
 */
const {
    TokenBot
} = require("./config")

/** 
 * @event ready
 * 
 * Lancement dut bot  
 * 
 */
bot.on('ready', () => {
    helpEmbed = new Discord.MessageEmbed()
        .setColor('#FFFFFF')
        .setTitle('Help  ')
        .setThumbnail(bot.user.avatarURL())
        .addField('prefix', 'info de la commande', true)
        .addField( 'commande2', 'info de la commande', true)
        .addField( 'commande3', 'info de la commande', true)
        .addField('-', 'github : (https://github.com/jujulodace/botDiscordLicenseLaRochelle)', false)
        .setFooter("footer. message en bas quoi..");
})
/** 
 * @event guildCreate
 * @param {guild} guild serveur disccord
 * 
 * arriver du bot sur un serveur
 * 
 */
bot.on("guildCreate", guild => {
    param[guild.id] = {}
    param[guild.id].general = guild.channels.cache.filter(channel => channel.type === "text").first().id; //défini le premier channel text trouver comme default
    param[guild.id].prefix = "/"
    guild.channels.cache.get(param[guild.id].general).send("le channel par default du bot est celui ci, le préfix par default du bot est /. pour voir les commandes disponibles, écrire prefix + help, donc actuellement /help")
    fs.writeFileSync("parametre.json", JSON.stringify(param)) //sauvegarde des parametres
});

/** 
 * @event message Emitted whenever a message is created.
 * @param {message} message message a l'origine de l'événement 
 * 
 * un utilisateur ou un bot envoie un message sur un channel d'un serveur sur lequel le bot est présent
 * 
 */
bot.on('message', (message) => {
    mes = message.content.split(" ");
    mes[0] = mes[0].toLowerCase()
    try {
        if (mes[0][0] === param[message.guild.id].prefix) {
            switch (message.content.substring(1)) {//supprime le premier chacractère
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
/** 
 * @event voiceStateUpdate Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
 * 
 * @param {channel} oldState channel vocal d'origine de l'utilisateur 
 * @param {channel} newState nouveau channel vocal de l'utilisateur 
 * 
 * un utiliateur viens de se connecter ou deconnecter d'un channel vocal. ou mutes/unmutes
 * 
 */
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
/**
 * 
 * @param {message} message  message d'origine 
 * 
 * envoie l'embed help dans le channel de provenance du message
 */
const help = (message) => message.channel.send(helpEmbed)
/**
 * 
 * @param {channel} channel channel text
 * 
 * Modifie le channel default pour le bot sur ce serveur
 */
const setGeneral = (channel) => param[channel.guild.id].general = channel
/**
 * 
 * @param {message} message message d'origine
 * 
 * Modifie le prefix pour le bot sur ce serveur
 */
const setPrefix = (message) => param[message.guild.id].prefix = message.content[0]


/**
 * 
 * @param {user} author autheur du message d'origine
 * @param {guild} serveur serveur actuel
 */
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
/**
 * 
 * @param {string} name nom du channel onirigal
 * @param {int} parent  id d'un salon du groupe
 * @param {int} groupeSubber channel référent du groupe
 * @param {gui} serveur serveur actuelle
 * 
 * génére une copie d'un channel audio
 */
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
/**
 * se connecte a discord
 */
bot.login(TokenBot);