const { Client, GatewayIntentBits } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { createAudioPlayer, createAudioResource, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const {youtubeapi} = require("../config.json")
const search = require('youtube-api-v3-search');

const { token } = require("../config.json");

// Créez un lecteur audio
const audioPlayer = createAudioPlayer();
const queue = [];
let isPlaying = false;

const rest = new REST({ version: '10' }).setToken(token);

module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    const commandName = interaction.commandName;
    const options = interaction.options;

    if (commandName === 'play') {
      const query = options.getString('musique');
      const voiceChannel = interaction.member.voice.channel;
    
      if (!voiceChannel) {
        await interaction.reply('Rejoignez d\'abord un salon vocal !');
        return;
      }
    
      // Recherchez la vidéo correspondante au nom donné
      search(query, { maxResults: 1, key: youtubeapi }, async (error, result) => {
        if (error) {
          console.error(error);
          await interaction.reply('Erreur lors de la recherche de la musique.');
          return;
        }
    
        if (result.items.length === 0) {
          await interaction.reply('Aucun résultat trouvé.');
          return;
        }
    
        const videoId = result.items[0].id.videoId;
        const videoTitle = result.items[0].snippet.title;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
        // Ajoutez la musique à la file d'attente
        queue.push(videoUrl);
    
        if (!isPlaying) {
          playNext(voiceChannel);
        }
    
        interaction.reply(`Ajouté à la file d'attente : ${videoTitle}`);
      });
    }

    if (commandName === 'urlplay') {
      const query = options.getString('url');
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        await interaction.reply('Rejoignez d\'abord un salon vocal !');
        return;
      }

      // Ajouter la musique à la file d'attente
      queue.push(query);

      if (!isPlaying) {
        playNext(voiceChannel);
      }

      interaction.reply(`Ajouté à la file d'attente : ${query}`);
    }



    if (commandName === 'skip') {
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        await interaction.reply('Rejoignez d\'abord un salon vocal !');
        return;
      }

      // Sauter la musique en cours de lecture
      audioPlayer.stop();
      interaction.reply('Musique suivante.');
    }

    if (commandName === 'queue') {
      // Afficher la liste d'attente complète
      const queueList = queue.map((item, index) => `${index + 1}. ${item}`).join('\n');
      interaction.reply(`File d'attente : \n${queueList}`);
    }

    if (commandName === 'stop') {
      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        await interaction.reply('Rejoignez d\'abord un salon vocal !');
        return;
      }

      // Arrêter la lecture et vider la file d'attente
      audioPlayer.stop();
      queue.length = 0; // Vide la file d'attente
      interaction.reply('Arrêt de la musique et vidage de la file d\'attente.');
    }
  }
};

// Fonction pour jouer la prochaine musique de la file d'attente
const playNext = async (voiceChannel) => {
  if (queue.length === 0) {
    isPlaying = false;
    return;
  }

  isPlaying = true;

  const query = queue.shift();
  const voiceConnection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  const stream = ytdl(query, { filter: 'audioonly' });
  const resource = createAudioResource(stream);

  resource.metadata = { query };

  audioPlayer.play(resource);
  voiceConnection.subscribe(audioPlayer);

  audioPlayer.on('stateChange', (oldState, newState) => {
    if (newState.status === 'idle') {
      playNext(voiceChannel);
    }
  });
};
