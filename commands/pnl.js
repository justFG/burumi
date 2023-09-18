const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, VoiceConnectionStatus } = require('@discordjs/voice');
const fs = require('fs');
const stringSimilarity = require('string-similarity');

// Déclarer le lecteur audio global
const audioPlayer = createAudioPlayer();

module.exports = async (client, interaction) => {

    if (interaction.isCommand()) {

        const commandName = interaction.commandName;
        const options = interaction.options;

        if (commandName === 'pnlplay') {
            if (!interaction.member.voice.channel) {
                return interaction.reply('Veuillez rejoindre un salon vocal d\'abord.');
            }

            const voiceChannel = interaction.member.voice.channel;

            const permissions = voiceChannel.permissionsFor(interaction.client.user);
            if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
                return interaction.reply('Je n\'ai pas la permission de rejoindre ou de parler dans ce salon vocal.');
            }

            try {
                const musiqueName = options.get('musique').value.toLowerCase(); // Convertir en minuscules
                const musicFiles = fs.readdirSync('./musics').map(fileName => fileName.toLowerCase()); // Convertir en minuscules
                let foundMusic = '';

                // Recherche de la musique la plus proche
                const similarities = stringSimilarity.findBestMatch(musiqueName, musicFiles);
                if (similarities.bestMatch.rating > 0.3) {
                    foundMusic = similarities.bestMatch.target;
                }

                if (!foundMusic) {
                    return interaction.reply('Cette musique n\'existe pas. Essayez avec un nom similaire.');
                }

                const audioFilePath = `./musics/${foundMusic}`;
                const audioResource = createAudioResource(fs.createReadStream(audioFilePath));

                // Utiliser le lecteur audio global pour jouer la musique
                audioPlayer.play(audioResource);

                let connection = getVoiceConnection(interaction.guild.id);

                if (connection && connection.status === VoiceConnectionStatus.Ready) {
                    connection.destroy(); // Fermer la connexion vocale existante si elle est prête
                }

                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator,
                });

                connection.subscribe(audioPlayer);

                interaction.reply(`Je joue maintenant la musique "${foundMusic}" dans le salon vocal ${voiceChannel.name}`);
            } catch (error) {
                console.error(error);
                interaction.reply('Une erreur s\'est produite lors de la lecture de la musique.');
            }
        }

        // Ajouter la commande "pause"
        if (commandName === 'pnlpause') {
            const connection = getVoiceConnection(interaction.guild.id);

            if (connection && connection.state.status === VoiceConnectionStatus.Ready) {
                audioPlayer.pause();
                interaction.reply('La musique est en pause.');
            } else {
                interaction.reply('Aucune connexion vocale n\'est établie.');
            }
        }

        // Ajouter la commande "resume"
        if (commandName === 'pnlresume') {
            const connection = getVoiceConnection(interaction.guild.id);

            if (connection && connection.state.status === VoiceConnectionStatus.Ready) {
                audioPlayer.unpause();
                interaction.reply('La musique reprend.');
            } else {
                interaction.reply('Aucune connexion vocale n\'est établie.');
            }
        }
    }
};
