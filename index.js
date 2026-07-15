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
    // Ban command
    else if (message.content.startsWith('!ban')) {
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('You do not have permission to use this command!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: !ban @user reason');
        member.ban({ reason });
        client.channels.cache.get('1526959249605922887').send(`🔨 **Banned:** ${member.user.tag} | **Reason:** ${reason} | **By:** ${message.author.tag}`);
        message.reply('User banned successfully.');
    }
    // Kick command
    else if (message.content.startsWith('!kick')) {
        if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('You do not have permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: !kick @user reason');
        member.kick(reason);
        client.channels.cache.get('1526959249605922887').send(`🥾 **Kicked:** ${member.user.tag} | **Reason:** ${reason} | **By:** ${message.author.tag}`);
        message.reply('User kicked successfully.');
    }
    // Mute command
    else if (message.content.startsWith('!mute')) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('You do not have permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: !mute @user reason');
        member.roles.add('MUTED_ROLE_ID_HERE'); // Buraya Muted rolunun ID-sini yaz
        client.channels.cache.get('1526959249605922887').send(`🔇 **Muted:** ${member.user.tag} | **Reason:** ${reason} | **By:** ${message.author.tag}`);
        message.reply('User muted successfully.');
    }
});

client.login(process.env.TOKEN);
