const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');


module.exports = async (client, interaction) => {

    if (interaction.isCommand()) {

        
        const commandName = interaction.commandName;
        const options = interaction.options;

        if (commandName === 'supr') {
            if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                const numberToDelete = options.get('nombre').value;

                if (isNaN(numberToDelete) || numberToDelete < 1 || numberToDelete > 100) {
                    return interaction.reply('Le nombre de messages à supprimer doit être compris entre 1 et 100.');
                }

                try {
                    const fetchedMessages = await interaction.channel.messages.fetch({ limit: numberToDelete });
                    interaction.channel.bulkDelete(fetchedMessages, true); // surpimer les messages

                    interaction.reply(`Supprimé ${numberToDelete} messages avec succès.`); //declaration des mess suprimées

                    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
                    await delay(1000) // cooldown de 1sec
                    const afterfetchedMessages = await interaction.channel.messages.fetch({ limit: 1 });
                    interaction.channel.bulkDelete(afterfetchedMessages, true);// supression du message declaré 
                }
                catch (error) {
                    console.error(error);
                    interaction.reply('Une erreur s\'est produite lors de la suppression des messages.'); //si ya une erreur ca va envoyer ca
                }
            } else {
                interaction.reply("Vous n'avez pas les droits requis pour utiliser cette commande.");
            }
        }

    }
};