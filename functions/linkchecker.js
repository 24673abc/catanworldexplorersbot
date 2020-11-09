module.exports = {
    async execute(message) {
        const Discord = require('discord.js');
        const { bot, channels, roles } = require("../data.json");

        //admins/moderators/minimods bypass link detection
        if (message.member.roles.cache.has(roles.admin_ID) || message.member.roles.cache.has(roles.moderator_ID) || message.member.roles.cache.has(roles.minimod_ID)) {
            return;
        }

        //see: https://regex101.com/r/rkT1y8/1/
        let discordInvitePattern = /(discord\.(gg|io|me|li)|discord(app)?\.com\/invite)\/[a-z0-9]+/gi;

        //check message
        if (discordInvitePattern.test(message.content)) {
            //if there's a link included
            if (message.mentions.members.first() != undefined) {
                if (message.mentions.members.first().roles.cache.has(roles.admin_ID) || message.mentions.members.first().roles.cache.has(roles.moderator_ID) || message.mentions.members.first().roles.cache.has(roles.minimod_ID)) {
                    //if an allowed role admin/moderator/minimod got mentioned in the message   
                    return sendApproval();
                }
            }
            sendWarning();
        }

        function sendWarning() {
            let embed = new Discord.MessageEmbed().setColor(bot.color).setTitle('Discord invite detected').setDescription('Posting discord invites without permission is not allowed, send a DM to an admin or moderator for approval.').setAuthor(message.member.user.tag).setTimestamp().setThumbnail(message.member.user.displayAvatarURL());

            message.channel.send(embed);
            message.delete();

            let logChannel = message.guild.channels.cache.get(channels.log_ID);
            let logembed = new Discord.MessageEmbed().setColor(bot.color).setTitle('Discord invite deleted').addField('message', message.content).setAuthor(message.member.user.tag).setTimestamp().setThumbnail(message.member.user.displayAvatarURL());

            logChannel.send(logembed);
        }

        function sendApproval() {
            let logChannel = message.guild.channels.cache.get(channels.log_ID);
            let approvedEmbed = new Discord.MessageEmbed().setColor(bot.color).setTitle('Link approved').addField('message', message.content).addField("approved by", message.mentions.members.first().user.tag).setAuthor(message.member.user.tag).setTimestamp().setThumbnail(message.member.user.displayAvatarURL());
            logChannel.send(approvedEmbed);
        }
    },
};
