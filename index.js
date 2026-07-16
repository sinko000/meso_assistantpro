const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');

// Uptime üçün server
const app = express();
app.get('/', (req, res) => res.status(200).send('Voice bot is 24/7 online!'));
app.listen(process.env.PORT || 10000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Bot qoşulan kimi səs kanalına girməsi üçün
client.on('ready', () => {
    console.log(`Voice Bot aktivdir: ${client.user.tag}`);
    
    // Bura səs kanalına qoşulma funksiyası
    const channelId = 'SƏS_KANAL_İD_BƏRİ'; // Buraya kanal ID-sini yaz
    const guildId = 'SERVER_İD_BƏRİ';      // Buraya server ID-sini yaz

    const channel = client.channels.cache.get(channelId);
    if (!channel) return console.log("Kanal tapılmadı!");

    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false // Səssizə almasın deyə
    });
    console.log("Səs kanalına uğurla qoşuldu.");
});

client.login(process.env.TOKEN);
