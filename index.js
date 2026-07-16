const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');

// Uptime server
const app = express();
app.get('/', (req, res) => res.status(200).send('Voice bot is active!'));
app.listen(process.env.PORT || 10000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('.join ')) return;

    const args = message.content.split(' ');
    const channelId = args[1];

    if (!channelId) return message.reply('Please provide a channel ID. Usage: .join [channelId]');

    const channel = client.channels.cache.get(channelId);
    if (!channel) return message.reply('Channel not found!');

    try {
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false
        });
        message.reply(`Successfully joined to channel: ${channel.name}`);
    } catch (error) {
        message.reply('Failed to join the voice channel.');
        console.error(error);
    }
});

client.login(process.env.TOKEN);
