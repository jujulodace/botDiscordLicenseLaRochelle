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
    voiceUp
} = require("./vocal")
//const { clear } = require('console')

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
    groupEmbed = new Discord.MessageEmbed()
        .setColor('#FFFFFF')
        .setTitle('Groupes ')
        .setThumbnail(bot.user.avatarURL())
        .addField('Groupes', 'Dans la promo, il existe 3 groupe de TD, ainsi que 4 groupe de TD d\'anglais. Ces dernier sont nommées TD1, TD2, TD3. ainsi que TDA1, TDA2, TDA3 et TDA4, pour l\'anglais.', true)
        .addField('clear', 'étant donner le quiproco dans la gestion des groupe, si le groupe TD que vous avez rejoin n\'est pas le Boolean, il est possible de réinitialiser ses role de groupe avec la réaction "croix rouge", ou en écrivant /groupe clear', true)
        .addField('rejoindre un groupe', 'Pour rejoindre un groupe, il faudrat réagir au bon emoji, ou écrire, par exemple /groupe TD1. Attention, il n\'est bien entendu possible de rejoindre  un seul groupe de TD, et un seul groupe de TDA', true)
        .addField('/log', 'Afin de vérifier que le bot a bien réagis, ci dessous se trouvent les action d\'ajout ou suppression de role de la dernière minute.', true);
    bot.user.setActivity('la doc', { type: 'WATCHING' })
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
                case "make":
                    makeRole(message.guild,mes[2])
                    break;
                case "groupe":
                    message.channel.send(groupEmbed).then(message => {
                        message.react("🥇")
                        message.react("🥈")
                        message.react("🥉")
                        message.react("1️⃣")
                        message.react("2️⃣")
                        message.react("3️⃣")
                        message.react("4️⃣")
                        message.react("❌")
                        const filter = (reaction, user) => {
                            return ['🥇', '🥈', '🥉', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '❌'].includes(reaction.emoji.name) && user.id !== message.author.id;
                        };
                        const collector = message.createReactionCollector(filter);

                        collector.on('collect', (reaction, user) => {
                            console.log(`Collected ${reaction.emoji.name} from ${user.id}`);
                            const name = reaction.emoji.name
                            switch (name) {
                                case "🥇" || "TD1": message.channel.send("role TD1")
                                    addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD1").first())
                                    break;
                                case "🥈": message.channel.send("role TD2")
                                    addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD2").first())
                                    break;
                                case "🥉": message.channel.send("role TD3")
                                    addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD3").first())
                                    break;
                                case "1️⃣": message.channel.send("role TDA1")
                                    addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TDA1").first())
                                    break;
                                case "2️⃣": message.channel.send("role TDA2")
                                    addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TDA2").first())
                                    break;
                                case "3️⃣": message.channel.send("role TDA3")
                                    addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TDA3").first())
                                    break;
                                case "4️⃣": message.channel.send("role TDA4")
                                    addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TDA4").first())
                                    break;
                                case "❌": message.channel.send("clear roles")
                                    break;
                                default:
                                    break;
                            }
                        });

                        collector.on('end', collected => {
                            console.log(`Collected ${collected.size} items`);
                        });
                    })
                    //addGroupe(message, message.member.guild.roles.cache.filter(role => role.name === mes[1]).first())
                    break;
                case "restart":
                    if (message.author.id == "191277501035708417") {
                        restart()
                    }
                    break;
                case "clear":
                    if (mes.length == 2 && message.member.roles.cache.get("751806478029160510")) {
                        clear(mes[1], message)
                    } else {

                        message.channel.send("droits insuffisant" + mes.length + " " + message.member.roles.cache.get("751806478029160510").name)
                    }
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
    voiceUp(oldState, newState)
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
const addGroupe = (member, role) => {
    if (role.name == "TD1" || role.name == "TD2" || role.name == "TD3" || role.name == "TD4") {
        member.roles.add(role);
        //message.channel.send(`ajout du role ${role.name}`)
    }

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

const clear = (number, message) => {
    console.log(number)
    message.channel.bulkDelete(Number(number))
        .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
        .catch(console.error);
}

const makeRole = (guild, name) => {
    guild.roles.create({
        data: {
            name: name,
        }
    })
    
}
/**
 * restart toutes les 2h afin de vérifier l'activité du bot
 */
setInterval(restart, 7200000);

/**
 * se connecte a discord
 */
bot.login(TokenBot);