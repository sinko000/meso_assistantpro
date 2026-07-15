const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const express = require('express');

// 1. Serveri əvvəlcə qaldırırıq
const app = express();
const port = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.status(200).send('Bot is active and running!');
});

app.listen(port, () => console.log(`Server is running on port ${port}`));

// 2. Discord klientini konfiqurasiya edirik
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// 3. Bot hazır olanda loga yazaq
client.once('ready', () => {
    console.log(`Bot logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('.')) return;

    // Komandalar
    if (message.content === '.join') {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply('Please join a voice channel first!');
        joinVoiceChannel({ 
            channelId: channel.id, 
            guildId: channel.guild.id, 
            adapterCreator: channel.guild.voiceAdapterCreator 
        });
        message.reply('Successfully joined the voice channel!');
    }
    else if (message.content === '.ping') {
        message.reply('Pong! 🏓');
    }
    else if (message.content === '.leave') {
        const connection = getVoiceConnection(message.guild.id);
        if (connection) { 
            connection.destroy(); 
            message.reply('Successfully left the voice channel!'); 
        }
        else { message.reply('I am not in a voice channel!'); }
    }
    // ... [Digər komandalarınız eyni qaydada qalır] ...
    
    // Embed Komandaları
    else if (message.content === '.server') {
        const embed = new EmbedBuilder()
            .setTitle(`Server: ${message.guild.name}`)
            .addFields(
                { name: 'Total Members', value: `${message.guild.memberCount}`, inline: true },
                { name: 'Owner', value: `<@${message.guild.ownerId}>`, inline: true }
            )
            .setColor(0x0099FF);
        message.reply({ embeds: [embed] });
    }
    // ... [Digər embed komandalarınız] ...
});

// 4. Tokeni ən sonda çağırırıq
client.login(process.env.TOKEN);
