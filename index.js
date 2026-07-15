const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is online and running!'));
const port = process.env.PORT || 3000;
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
    // Prefix check: Only proceed if message starts with '.'
    if (!message.content.startsWith('.')) return;

    // !join -> .join
    if (message.content === '.join') {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply('Please join a voice channel first!');
        
        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        message.reply('Successfully joined the voice channel!');
    }
    // .ping command
    else if (message.content === '.ping') {
        message.reply('Pong! 🏓');
    }
    // .leave command
    else if (message.content === '.leave') {
        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            connection.destroy();
            message.reply('Successfully left the voice channel!');
        } else {
            message.reply('I am not in a voice channel!');
        }
    }
    // .ban command
    else if (message.content.startsWith('.ban')) {
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('You do not have permission to use this command!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: .ban @user reason');
        member.ban({ reason });
        client.channels.cache.get('1526959249605922887').send(`🔨 **Banned:** ${member.user.tag} | **Reason:** ${reason} \vert{} **By:**${message.author.tag}`);
        message.reply('User banned successfully.');
    }
    // .kick command
    else if (message.content.startsWith('.kick')) {
        if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('You do not have permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: .kick @user reason');
        member.kick(reason);
        client.channels.cache.get('1526959249605922887').send(`🥾 **Kicked:** ${member.user.tag} | **Reason:** ${reason} \vert{} **By:**${message.author.tag}`);
        message.reply('User kicked successfully.');
    }
    // .mute command
    else if (message.content.startsWith('.mute')) {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.reply('You do not have permission!');
        const member = message.mentions.members.first();
        const reason = message.content.split(' ').slice(2).join(' ');
        if (!member || !reason) return message.reply('Usage: .mute @user reason');
        member.roles.add('MUTED_ROLE_ID_HERE'); 
        client.channels.cache.get('1526959249605922887').send(`🔇 **Muted:** ${member.user.tag} | **Reason:** ${reason} \vert{} **By:**${message.author.tag}`);
        message.reply('User muted successfully.');
    }
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

// İstifadəçiləri yadda saxlamaq üçün siyahı
const ballUsers = new Set();

client.on('messageCreate', async (message) => {
    // 1. Avtomatik etiketləmə funksiyası (Countryball botunun mesajını izləyir)
    // Bot ID: 999736048596816014 | Kanal ID: 1322625226768384130
    if (message.author.id === '999736048596816014' && message.channel.id === '1322625226768384130') {
        if (message.content.includes('new countryball spawner')) {
            const mentions = Array.from(ballUsers).map(id => `<@${id}>`).join(' ');
            if (mentions.length > 0) {
                message.channel.send(`Hey ${mentions}, a new countryball spawned!`);
            }
        }
    }

    // Prefix yoxlaması
    if (!message.content.startsWith('.')) return;

    // .ballon komandası
    if (message.content === '.ballon') {
        ballUsers.add(message.author.id);
        message.reply('✅ Notifications enabled! You will be pinged when a countryball spawns.');
    }
    // .balloff komandası
    else if (message.content === '.balloff') {
        ballUsers.delete(message.author.id);
        message.reply('❌ Notifications disabled.');
    }
    // .ballstatus komandası
    else if (message.content === '.ballstatus') {
        const status = ballUsers.has(message.author.id) ? 'ON 🟢' : 'OFF 🔴';
        message.reply(`**Countryball Status:**\n-------------------\nStatus: ${status}\n-------------------`);
    }

    // Digər komandalar (join, ping, leave, ban, kick, mute...)
    // ... bura əvvəlki kodlarını olduğu kimi qoya bilərsən
    else if (message.content === '.join') { /* ... */ }
    // ... digərləri ...
});

client.login(process.env.TOKEN);
});

client.login(process.env.TOKEN);
