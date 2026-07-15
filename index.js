else if (message.content.startsWith('.dm ')) {
        // Yalnız adminlər istifadə edə bilsin (təhlükəsizlik üçün)
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('❌ You do not have permission to use this command!');
        }

        const args = message.content.split(' ').slice(1).join(' ');
        if (!args) return message.reply('Usage: .dm [message]');

        const members = await message.guild.members.fetch();
        let successCount = 0;
        let failCount = 0;

        message.reply(`⏳ Sending DM to ${members.size} members... please wait.`);

        for (const [id, member] of members) {
            // Botun özünə və digər botlara mesaj göndərməsin
            if (member.user.bot) continue;

            try {
                await member.send(args);
                successCount++;
            } catch (err) {
                failCount++;
            }
        }

        message.channel.send(`✅ **DM Finished!**\nSent to: ${successCount} members.\nFailed (DM closed): ${failCount} members.`);
    }
