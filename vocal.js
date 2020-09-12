const param = require('./parametre.json')
const fs = require("fs")
    
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
                serveur.channels.cache.get(param[serveur.id].general).send(`channel ${channel.name} add`)
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
 * 
 * @param {channel} oldState channel vocal d'origine de l'utilisateur 
 * @param {channel} newState nouveau channel vocal de l'utilisateur 
 * 
 * appel a la fonction de gestion
 */
const voiceUp = (oldState, newState) => {
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
}
module.exports.voiceUp = voiceUp;
module.exports.makeSubChannel = makeSubChannel;
module.exports.addchannel = addchannel;