module.exports = {
    name: 'unmute',
    category: 'Moderation',
    usage: '<membermention>',
    description: 'Unmute a member.',
    execute(message) {
        const sendEmbed = require('../functions/sendembed.js');
        const roles = require('../data.json').roles;
        const muted = message.guild.roles.cache.get(roles.muted_ID);
        const muteMember = message.mentions.members.first();
        let stop = false;

        if (!muteMember) {
            return message.channel.send(':warning: Make sure to mention the person you want to unmute.');
        }

        if (muteMember.id == message.guild.me.id) {
            return message.channel.send(':warning: I cannot unmute myself.');
        }
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            return message.channel.send(':warning: You need the `MANAGE_ROLES` permission in order to unmute someone.');
        }
        if (message.member.id == muteMember.id) {
            return message.channel.send(':warning: You cannot unmute yourself.');
        }
        if (message.member.roles.highest.comparePositionTo(muteMember.roles.highest) <= 0 && message.member.id !== message.guild.owner.id) {
            return message.channel.send(`:warning: You don't have the permission to unmute \`${muteMember.displayName}\` because you have a lower or equal role.`);
        }
        if (!muteMember.roles.cache.has(muted.id)) {
            return message.channel.send(':warning: This person isn\'t muted.');
        }

        if (muted) {
            muteMember.roles.remove(muted.id)
                .catch(() => {
                    stop = true;
                    message.channel.send(`:warning: I cannot unmute \`${muteMember.displayName}\`.`);
                });
        } else {
            return message.channel.send(':warning: This command does not belong to this server.');
        }

        if (!stop) {
            sendEmbed.execute(message, `\`${muteMember.displayName}\` was unmuted`, 'Welcome back', 'both');
        }
    },
};