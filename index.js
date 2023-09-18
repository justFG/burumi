const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ActionRowBuilder,
    Events,
    StringSelectMenuBuilder,
    ActivityType,
    ChannelType,
    MessageActionRow,
    MessageSelectMenu,
    MessageButton,
    MessageEmbed,
    StringSelectMenuOptionBuilder,
    PermissionsBitField,
    Guild
} = require('discord.js');
const Discord = require("discord.js")
const {token} = require("./config.json")
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});
const moment = require('moment-timezone');
moment.tz.setDefault('Africa/Algiers');


//logged
client.on('ready', () => {
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(`Logged in as ${client.user.tag} - Heure en Algérie : ${currentDate}`);

        //send je suis en ligne
        const serverId = '1150863000228593734';
        const channelId = '1152207465874726913'; 
        const server = client.guilds.cache.get(serverId);
        const channel = server.channels.cache.get(channelId);
      
      
        // Envoyez le message "Je suis en ligne" dans le salon
        channel.send(`je suis en ligne ! - Heure en Algérie : ${currentDate}`);


//declarations de commandes
    client.application.commands.create({
        name: 'supr',
        description: 'Supprime un nombre spécifique de messages.',
        type: 1,
        options: [
            {
                name: 'nombre',
                description: 'Le nombre de messages à supprimer.',
                type: 4,
                required: true,
            },
        ],
    });


    client.application.commands.create({
        name: 'ping',
        description: 'Affiche la latence',
        type: 1,
    });

    client.application.commands.create({
        name: 'pnlplay',
        description: 'jouer de la musique.',
        type: 1,
        options: [
            {
                name: 'musique',
                description: 'Le nom de la musique',
                type: 3,
                required: true,
            },
        ],
    });

    client.application.commands.create({
        name: 'pnlresume',
        description: 'reprendre la musique',
        type: 1,
    });

    client.application.commands.create({
        name: 'pnlpause',
        description: 'pauser la musique',
        type: 1,
    });

    client.application.commands.create({
        name: 'pnlqueue',
        description: 'affricher la file d\'attente des musiques',
        type: 1,
    });

    client.application.commands.create({
        name: 'pnlfind',
        description: 'trouver une musique.',
        type: 1,
        options: [
            {
                name: 'musique',
                description: 'Le nom de la musique',
                type: 3,
                required: true,
            },
        ],
    });

    client.application.commands.create({
        name: 'pnlist',
        description: 'donner la liste des musiques',
        type: 1,
    });

    client.application.commands.create({
        name: 'pnlskip',
        description: 'passer a la prochaine musique',
        type: 1,
    });


   // player
    client.application.commands.create({
        name: 'play',
        description: 'jouer de la musique',
        type: 1,
        options: [
            {
                name: 'musique',
                description: 'Le nom de la musique',
                type: 3,
                required: true,
            },
        ],
    });

    client.application.commands.create({
        name: 'urlplay',
        description: 'jouer de la musique',
        type: 1,
        options: [
            {
                name: 'url',
                description: 'lancer une musique a partir d\'un url',
                type: 3,
                required: true,
            },
        ],
    });

    client.application.commands.create({
        name: 'stop',
        description: 'arreter la musique',
        type: 1,
    });
    
    client.application.commands.create({
        name: 'skip',
        description: 'arreter la musique',
        type: 1,
    });

    client.application.commands.create({
        name: 'queue',
        description: 'arreter la musique',
        type: 1,
    });


    //activity
    client.user.setActivity({
        name: "tester des commandes",
        type: ActivityType.Playing
    });


});



//files check
client.on("interactionCreate", interaction => require("./commands/purge.js")(client, interaction))
client.on("interactionCreate", interaction => require("./commands/ping.js")(client, interaction))
client.on("interactionCreate", interaction => require("./commands/pnlplay.js")(client, interaction))
client.on("interactionCreate", interaction => require("./commands/pnlfind.js")(client, interaction))
client.on("interactionCreate", interaction => require("./commands/pnlist.js")(client, interaction))
client.on("interactionCreate", interaction => require("./commands/player.js")(client, interaction))


//login check
client.login(token);

