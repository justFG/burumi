const fs = require('fs');

module.exports = async (client, interaction) => {

    if (interaction.isCommand()) {

        const commandName = interaction.commandName;

        if (commandName === 'pnlist') {
            // Fonction pour obtenir la liste des noms de fichiers sans extension dans un dossier
            function getFilesWithoutExtension(directoryPath, charsToSkip) {
                const files = fs.readdirSync(directoryPath);
                const filesWithoutExtension = files.map(file => {
                    // Utilisez .split() pour diviser le nom de fichier en fonction du point (.)
                    const parts = file.split('.');
                    // Retournez toutes les parties sauf la dernière (l'extension) et en utilisant .slice() pour sauter les premiers caractères
                    return parts.slice(0, -1).join('').substring(charsToSkip);
                });
                return filesWithoutExtension;
            }

            // Remplacez './musics' par le chemin de votre dossier
            const folderPath = './musics';
            const charsToSkip = 10; // Le nombre de caractères à sauter
            const filesWithoutExtension = getFilesWithoutExtension(folderPath, charsToSkip);
            const fileList = filesWithoutExtension.join('\n');

            // Envoyez la liste des noms de fichiers sans extension dans le chat Discord
            interaction.reply(`Liste des musiques : \n${fileList}`);
        }
    }
};
