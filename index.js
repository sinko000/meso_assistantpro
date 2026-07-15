const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.status(200).send('Bot is active!'));
const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`Server is running on port ${port}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers // DM komandası üçün lazımdır
    ]
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.content.startsWith('.')) return;

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
        if (connection) { connection.destroy(); message.reply('Successfully left!'); }
        else { message.reply('I am not in a voice channel!'); }
    }
    else if (message.content.startsWith('.ban')) {
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('No permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: .ban @user reason');
        await member.ban({ reason });
        message.reply('User banned successfully.');
    }
    else if (message.content.startsWith('.kick')) {
        if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('No permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: .kick @user reason');
        await member.kick(reason);
        message.reply('User kicked successfully.');
    }
    else if (message.content.startsWith('.mute')) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('No permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: .mute @user reason');
        member.roles.add('MUTED_ROLE_ID_HERE');
        message.reply('User muted successfully.');
    }
    else if (message.content === '.server') {
        const embed = new EmbedBuilder().setTitle(`Server: ${message.guild.name}`).addFields({ name: 'Total Members', value: `${message.guild.memberCount}`, inline: true }).setColor(0x0099FF);
        message.reply({ embeds: [embed] });
    }
    // .dm Komandası
    else if (message.content.startsWith('.dm ')) {
        if (!message.member.permissions.has('ADMINISTRATOR')) return message.reply('❌ No permission!');
        const args = message.content.split(' ').slice(1).join(' ');
        if (!args) return message.reply('Usage: .dm [message]');

        const members = await message.guild.members.fetch();
        let successCount = 0;
        let failCount = 0;

        message.reply(`⏳ Sending...`);
        for (const [id, member] of members) {
            if (member.user.bot) continue;
            try { await member.send(args); successCount++; } catch (err) { failCount++; }
        }
        message.channel.send(`✅ Finished! Sent: ${successCount}, Failed: ${failCount}`);
    }
});

client.login(process.env.TOKEN);
