const param = require('./parametre.json')
    
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
module.exports.makeSubChannel = makeSubChannel;
module.exports.addchannel = addchannel;