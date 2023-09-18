const Discord = require("discord.js")

module.exports = async (client, interaction) => {
    if (interaction.isCommand()) {
        
        const commandName = interaction.commandName;

        if (commandName === 'ping') {
            const ping = Date.now() - interaction.createdTimestamp;
            interaction.reply(`Ping : ${ping}ms`)

        }
    }
};