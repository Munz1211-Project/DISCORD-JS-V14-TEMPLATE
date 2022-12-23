const discord = require('discord.js');
const config = require('../../config.json');
const timezone = require("moment-timezone");

module.exports = {

    name: "ping",
    aliases: [],
    description: "Get bot's real time ping status",
    category: "Misc",
    cooldown: 5,
    run: async (client, message, args) => {

        if (!message.guild.members.me.permissions.has("EmbedLinks")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });

        try{
            const m = await message.channel.send('Pinging...')
            const embed = new discord.EmbedBuilder()
                .addFields({ name : '⏳ Latency', value: `_**${m.createdTimestamp - message.createdTimestamp}ms**_`, inline: true })
                .addFields({ name: '💓 API', value: `_**${client.ws.ping}ms**_`, inline: true })
                .setColor(config.color)
                .setFooter({ text: `Requested by ${message.author.username} | Today at ${timezone.tz("Asia/Jakarta").format("HH:mma") + " "}`, iconURL: message.author.displayAvatarURL({ 
                        forceStatic: true 
                    }) 
                })

            setTimeout(function() { m.edit({ content: ' ', embeds: [embed] }) }, 2000);
        } catch (e) {
            const embed = new discord.EmbedBuilder()
                .setDescription(`${e}`)
                .setColor(config.color)
            message.channel.send({ embeds: [embed] })
        }
    }
};
