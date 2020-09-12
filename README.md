Bonjour, voici le bot discord communautaire de la L2 info de la rochelle

Pourquoi avoir plein de bot discord provenant d'on ne sait ou alors qu'on peu coder toutes leurs fonctionnalités ? 

L'objectif n'est pas d'avoir une seul personnage gérant le bot, mais un vrai projet de groupe,N'importe qui pourras contribuer pour ajouter sa pierre a l'édifice, pour se faire, il suffit de cloner le dépot et d'ajouter ses modification dans une nouvelle branche, une fois la modification accepter, une fusion sera faite avec la branche principal

Le projet est un projet node js, il pourras "s'étendre" et n'est pas obligatoirement juste un bot discord, il est possible de faire appel a n'importe quel api, bd ou autre.... tout est possible.
De plus, le bot tourne actuellement sur une rasp PI, a l'adresse sangi.ddns.net, il est tout a fait possible d'héberger un site web en parallèle.

afin d'installer les dépencances : "npm install" ou "yarn install" si cela ne fonctionne pas installer node js et npm et/ou yarn 

il faut égallement créer un fhichier config.js selon le modéle.

Des conflit peuvent avoir lieu avec les fichier de sauvegarde de type "parametre.json". après quelques modifications, il sera ajouter dans le gitignore. En effet, pour le moment ce fichier est rempli par rapport au serveur a l'instant de son arriver. le bot ne trouve pas les parametre du serveur actuelle s'il est dessus et le fichier vide. 