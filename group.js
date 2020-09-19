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
    else if (mes.length === 2)
        messageAddGroup(message, mes[1])
    else {
        message.channel.send("nombre d'arguments invalide")
    }
    message.delete({ timeout: 3000 })
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
            addRole(name, message, user)
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
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
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD1").first())
            break;
        case "🥈": case "TD2":
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD2").first())
            break;
        case "🥉": case "TD3":
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TD3").first())
            break;
        case "1️⃣": case "TDA1":
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TDA1").first())
            break;
        case "2️⃣": case "TDA2":
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TDA2").first())
            break;
        case "3️⃣": case "TDA3":
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TDA3").first())
            break;
        case "4️⃣": case "TDA4":
            addGroupe(message.guild.members.cache.get(user.id), message.guild.roles.cache.filter(role => role.name === "TDA4").first())
            break;
        case "❌":
            if (message.member.roles.cache.get("751806478029160510")) {
                message.member.roles.set([])
            } else {
                message.member.roles.set([])
            }
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
    if (role.name == "TD1" || role.name == "TD2" || role.name == "TD3" || role.name == "TDA1" || role.name == "TDA2" || role.name == "TDA3" || role.name == "TDA4") {
        member.roles.add(role);
        //message.channel.send(`ajout du role ${role.name}`)
        log.send(`${logDate()} ajout du role ${role.name} a ${member.nickname}`)
    }
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
