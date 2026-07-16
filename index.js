const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');

// Uptime üçün sadə server
const app = express();
app.get('/', (req, res) => res.status(200).send('Voice bot is 24/7 online!'));
app.listen(process.env.PORT || 10000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`Bot aktivdir: ${client.user.tag}`);
    
    // Öz məlumatlarını bura yaz
    const channelId = 'BURAYA_SES_KANAL_ID_YAZ'; 
    const guildId = 'BURAYA_SERVER_ID_YAZ';      

    const channel = client.channels.cache.get(channelId);
    if (!channel) return console.log("Kanal tapılmadı!");

    joinVoiceChannel({
        channelId: channel.id,
        guildId: guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false 
    });
    console.log("Səs kanalına qoşuldu.");
});

client.login(process.env.TOKEN);
