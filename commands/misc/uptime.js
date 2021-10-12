const moment = require("moment");
require("moment-duration-format");
const discord = require("discord.js");
const config = require('../../config.json');

module.exports = {
        
        name: "uptime",
        category: "misc",
        aliases: ["up"],
        description: "Gives you bot's uptime",
        cooldown: 10,
        run: async (client, message, args) => {

                if (!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send({
                        content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
                });
                
                const duration = moment.duration(client.uptime).format("**D [Day] , H [Hours] , m [Minutes] , s [seconds]**");
                const embed = new discord.MessageEmbed()
                        .setDescription(
                                `**Uptime**: ${duration}`
                        )
                        .setColor(config.color);
                message.channel.send({
                        embeds: [embed]
                })
                        .then(msg => {
                                setTimeout(() => msg.delete().catch(() => null), 10000)
                        })
        },
};
