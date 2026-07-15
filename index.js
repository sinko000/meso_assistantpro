const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot is online!'));
app.listen(port, () => console.log(`Listening on port ${port}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('.')) return;

    // Mövcud Komandalar
    if (message.content === '.join') {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply('Please join a voice channel first!');
        joinVoiceChannel({ channelId: channel.id, guildId: channel.guild.id, adapterCreator: channel.guild.voiceAdapterCreator });
        message.reply('Successfully joined the voice channel!');
    }
    else if (message.content === '.ping') {
        message.reply('Pong! 🏓');
    }
    else if (message.content === '.leave') {
        const connection = getVoiceConnection(message.guild.id);
        if (connection) { connection.destroy(); message.reply('Successfully left the voice channel!'); }
        else { message.reply('I am not in a voice channel!'); }
    }
    else if (message.content.startsWith('.ban')) {
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('No permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: .ban @user reason');
        member.ban({ reason });
        client.channels.cache.get('1526959249605922887').send(`🔨 **Banned:** ${member.user.tag} | **Reason:** ${reason}`);
        message.reply('User banned successfully.');
    }
    else if (message.content.startsWith('.kick')) {
        if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('No permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: .kick @user reason');
        member.kick(reason);
        client.channels.cache.get('1526959249605922887').send(`🥾 **Kicked:** ${member.user.tag} | **Reason:** ${reason}`);
        message.reply('User kicked successfully.');
    }
    else if (message.content.startsWith('.mute')) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('No permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: .mute @user reason');
        member.roles.add('MUTED_ROLE_ID_HERE');
        client.channels.cache.get('1526959249605922887').send(`🔇 **Muted:** ${member.user.tag} | **Reason:** ${reason}`);
        message.reply('User muted successfully.');
    }

    // Yeni Embed Komandaları
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
    else if (message.content.startsWith('.user')) {
        const member = message.mentions.members.first() || message.member;
        const embed = new EmbedBuilder()
            .setTitle(`User: ${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                { name: 'ID', value: `${member.id}`, inline: true },
                { name: 'Joined', value: `${member.joinedAt.toDateString()}`, inline: true }
            )
            .setColor(0x00FF00);
        message.reply({ embeds: [embed] });
    }
    else if (message.content.startsWith('.avatar')) {
        const member = message.mentions.members.first() || message.member;
        const embed = new EmbedBuilder()
            .setTitle(`${member.user.tag}'s Avatar`)
            .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(0xFF0000);
        message.reply({ embeds: [embed] });
    }
});

client.login(process.env.TOKEN);
