const discord = require('discord.js')
const config = require('../../config.json');
const timezone = require("moment-timezone");

module.exports = {
        
        name: "ping",
        category: "misc",
        aliases: [],
        description: "Get bot's real time ping status",
        cooldown: 10,
        run: async(client, message, args) => {

                if (!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send({
                        content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
                });
                
                const m = await message.channel.send('Pinging...')
                const embed = new discord.MessageEmbed()
                        .setTitle('🏓 pong!')
                        .addField('⏳ Latency', `_**${m.createdTimestamp - message.createdTimestamp}ms**_`, true)
                        .addField('💓 API', `_**${client.ws.ping}ms**_`, true)
                        .setColor(config.color)
                        .setFooter(`Requested by ${message.author.username} | Today at ${timezone.tz("Asia/Jakarta").format("HH:mma") + " "}`, message.author.displayAvatarURL({
                                dynamic: true
                        }))
                return m.edit({
                                content: " ",
                                embeds: [embed]
                        })
                        .then(msg => {
                                setTimeout(() => msg.delete().catch(() => null), 15000)
                        })
        },
};
