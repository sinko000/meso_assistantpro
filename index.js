const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is online and running!'));
app.listen(3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.on('messageCreate', async (message) => {
    // !join command
    if (message.content === '!join') {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply('Please join a voice channel first!');
        
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        message.reply('Successfully joined the voice channel!');
    }
    // !ping command
    else if (message.content === '!ping') {
        message.reply('Pong! 🏓');
    }
    // !leave command
    else if (message.content === '!leave') {
        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            connection.destroy();
            message.reply('Successfully left the voice channel!');
        } else {
            message.reply('I am not in a voice channel!');
        }
    }
});

client.login(process.env.TOKEN);
