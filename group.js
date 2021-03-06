let log;
/**
 * 
 * @param {message} message 
 * @param {string[]} mes 
 * 
 * gestion de la création de groupe
 */
const ManageGroup = (message, mes) => {
    if (mes.length === 1)
        messageGroup(message)
    else if (mes.length === 2) {
        messageAddGroup(message, mes[1])
        message.channel.send("Action role effectuer")
    }
    else {
        message.channel.send("nombre d'arguments invalide")
    }

}
/**
 * 
 * @param {message} message 
 * 
 * ajout/suppression groupe par reaction
 */
const messageGroup = (message) => {
    message.channel.send(groupEmbed).then(message => {
        message.react("🥇")
        message.react("🥈")
        message.react("🥉")
        message.react("1️⃣")
        message.react("2️⃣")
        const filter = (reaction, user) => {
            return ['🥇', '🥈', '🥉', '1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id !== message.author.id;
        };
        const collector = message.createReactionCollector(filter, { dispose: true });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.id}`);
            const name = reaction.emoji.name
            addRole(name, message, user)
        });

        collector.on('remove', (reaction, user) => {
            console.log(`remove ${reaction.emoji.name} from ${user.id}`);
            const name = reaction.emoji.name
            removeRole(name, message, user)
        });

    })
}


/**
 * 
 * @param {string} name 
 * @param {message} message 
 * @param {user} user 
 * 
 * ajout du role 'name' a l'utilisateur 'user
 */
const addRole = (name, message, user) => {
    switch (name) {
        case "🥇": case "TD1":
            removeGroupeTD(message.guild.members.cache.get(user.id))
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD1").first())
            break;
        case "🥈": case "TD2":
            removeGroupeTD(message.guild.members.cache.get(user.id))
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD2").first())
            break;
        case "🥉": case "TD3":
            removeGroupeTD(message.guild.members.cache.get(user.id))
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD3").first())
            break;
        case "1️⃣": case "Ang_McGarry":
            removeGroupTDA(message.guild.members.cache.get(user.id))
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "Ang_McGarry").first())
            break;
        case "2️⃣": case "Ang_Bastiat":
            removeGroupTDA(message.guild.members.cache.get(user.id))
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "Ang_Bastiat").first())
            break;
        default:
            break;
    }
}

/**
 * 
 * @param {string} name 
 * @param {message} message 
 * @param {user} user 
 * 
 * suppression du role 'name' a l'utilisateur 'user
 */
const removeRole = (name, message, user) => {
    switch (name) {
        case "🥇": case "TD1":

            removeGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD1").first())
            break;
        case "🥈": case "TD2":

            removeGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD2").first())
            break;
        case "🥉": case "TD3":

            removeGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD3").first())
            break;
        case "1️⃣": case "Ang_Bastiat":

            removeGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "Ang_Bastiat").first())
            break;
        case "2️⃣": case "Ang_McGarry":

            removeGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "Ang_McGarry").first())
            break;
 
        default:
            break;
    }
}
/**
 * 
 * @param {message} message 
 * @param {string} name 
 * 
 * ajout role par message
 */
const messageAddGroup = (message, name) => {

    addRole(name, message, message.author)
}

/**
 * 
 * @param {member} member 
 * @param {role} role 
 */
const addGroupe = (member, role) => {
    if (role.name == "TD1" || role.name == "TD2" || role.name == "TD3" ||  role.name == "Ang_Bastiat" || role.name == "Ang_McGarry") {
        member.roles.add(role);
        //message.channel.send(`ajout du role ${role.name}`)
        log.send(`${logDate()} ajout du role ${role.name} a ${member.nickname}`)
    }
}

/**
 * 
 * @param {member} member 
 * @param {role} role 
 */
const removeGroupe = (member, role) => {
    if (role.name == "TD1" || role.name == "TD2" || role.name == "TD3" || role.name == "Ang_Bastiat" || role.name == "Ang_McGarry") {
        member.roles.remove(role)
        log.send(`${logDate()} suppression du role ${role.name} a`)
    }
}
const removeGroupeTD = (member) => {
    removeGroupe(member, member.guild.roles.cache.filter(role => role.name === "TD1").first())
    removeGroupe(member, member.guild.roles.cache.filter(role => role.name === "TD2").first())
    removeGroupe(member, member.guild.roles.cache.filter(role => role.name === "TD3").first())

}

const removeGroupTDA = (member) => {
    removeGroupe(member, member.guild.roles.cache.filter(role => role.name === "Ang_Bastiat").first())
    removeGroupe(member, member.guild.roles.cache.filter(role => role.name === "Ang_McGarry").first())
}


/**
 * retourne la date formater pour les logs
 */
const logDate = () => {
    let t = new Date();
    return (`[${t.getHours()}h${t.getMinutes()}m${t.getSeconds()}s${t.getMilliseconds()}ms]`)
}
const setLog = (channel) => {
    log = channel;
}

module.exports.ManageGroup = ManageGroup;
module.exports.setLog = setLog;
