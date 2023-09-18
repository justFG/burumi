const fs = require('fs');
const stringSimilarity = require('string-similarity');

module.exports = async (client, interaction) => {

    if (interaction.isCommand()) {

        const commandName = interaction.commandName;
        const options = interaction.options;

        if (commandName === 'pnlfind') {

            const musiqueName = options.get('musique').value;
            const searchString = musiqueName.toLowerCase(); // Convertir en minuscules
            const musicFiles = fs.readdirSync('./musics').map(fileName => fileName.toLowerCase()); // Convertir en minuscules
            const similarities = stringSimilarity.findBestMatch(searchString, musicFiles);

            if (similarities.bestMatch.rating > 0.3) {
                const closestMusicName = musicFiles[musicFiles.indexOf(similarities.bestMatch.target)];
                interaction.reply(`La musique la plus proche de "${musiqueName}" est "${closestMusicName}".`);
            } else {
                interaction.reply(`Aucune musique similaire à "${musiqueName}" n'a été trouvée.`);
            }

        }
    }
};
