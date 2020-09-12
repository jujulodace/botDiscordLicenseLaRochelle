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
const {
    addchannel,
    makeSubChannel
} = require("./vocal")

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
        .addField('/help', 'liste des commandes', true)
        .addField('/prefix', 'change le prefix', true)
        .addField('/default', 'change le channel de base du bot', true)
        .addField('/add', 'ajoute le channel vocal actif dans la liste des channel dynamique', true)
        .addField('depot github', ' [github](https://github.com/jujulodace/botDiscordLicenseLaRochelle)', false)
        .setFooter("blabla ");
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
    param[guild.id].channels = "/"
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
            switch (mes[0].substring(1)) {//supprime le premier chacractère
                case "help":
                    help(message)
                    break;
                case "default":
                    setGeneral(message.channel)
                    break;
                case "prefix":
                    console.log("oui")
                    setPrefix(message, mes[1])
                    break;
                case "add":
                    addchannel(message.author.id, message.guild)
                    break;
                case "groupe":
                    addGroupe(message, message.member.guild.roles.cache.filter(role => role.name === mes[1]).first())
                    break;
                default:
                    break;
            }
        }
    } catch (error) {
        message.channel.send("une erreur inatendu est survenue" + "```" + error + "```")
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
const setGeneral = (channel) => {
    param[channel.guild.id].general = channel.id
    channel.send(`Le nouveau channel du bot est ${channel.name}`)
}

/**
 * 
 * @param {message} message message d'origine
 * 
 * Modifie le prefix pour le bot sur ce serveur
 */
const setPrefix = (message, prefix) => {
    param[message.guild.id].prefix = prefix
    message.channel.send(`Le nouveau prefix du bot est ${prefix}`)
}





const addGroupe = (message, role) => {
    if (role.name == "TD1" || role.name == "TD2") {
        message.member.roles.add(role);
        message.channel.send(`ajout du role ${role.name}`)
    }
    else
        message.channel.send("impossible d'ajouter ce role")
}

/**
 * fonction restart du bot, et ajout dans le salon log
 */
const restart = async () => {
    let t1 = new Date();
    await bot.channels.cache.get("753958418426888273").send(`[${t1.getHours()}h${t1.getMinutes()}m${t1.getSeconds()}s${t1.getMilliseconds()}ms] restart bot process... `)
    await bot.destroy()
    await bot.login(TokenBot);
    t1 = new Date();
    await bot.channels.cache.get("753958418426888273").send(`[${t1.getHours()}h${t1.getMinutes()}m${t1.getSeconds()}s${t1.getMilliseconds()}ms] restart bot sucessful !`)
}
/**
 * restart toutes les 2h afin de vérifier l'activité du bot
 */
setInterval(restart, 7200000);

/**
 * se connecte a discord
 */
bot.login(TokenBot);