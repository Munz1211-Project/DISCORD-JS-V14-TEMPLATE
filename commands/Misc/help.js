const discord = require('discord.js')
const config = require('../../config.json');
const timezone = require("moment-timezone");
const { readdirSync } = require('fs');

module.exports = {

    name: "help",
    aliases: ["h", "cmd"],
    description: "Get's all Commmands, or one specific command",
    category: "Misc",
    cooldown: 5,
    run: async (client, message, args) => {

        if (!message.guild.members.me.permissions.has("EmbedLinks")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });

        if (!args[0]) {

            const categories = readdirSync(`./commands/`)

            const emo = {
                Misc: "❓ ・ ",
                Util: "⚙ ・ ",
                Owner: "👑 ・ ",
            };
    
            const embed = new discord.EmbedBuilder()
                .setAuthor({ name: `❯ ・ Commands list - ${client.commands.size} Commands`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setColor(config.color)
                .setFooter({ text: `Requested by ${message.author.username} | Today at ${timezone.tz("Asia/Jakarta").format("HH:mma") + " "}`, iconURL: message.author.displayAvatarURL({ 
                        dynamic: true 
                    }) 
                })
    
            for (const category of categories) {
                const commands = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``).join(", ", "\n");
                embed.addFields({ name: `${emo[category]} ${(category)} Commands`, value: `> ${commands}`, inline: false });
            }
    
            return message.channel.send({
                embeds: [embed]
            });


        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

            if (!command) {
                const embed = new discord.EmbedBuilder()
                        .setDescription(`Invalid command! Use \`${config.prefix}help\` for all of my commands!`)
                        .setColor(config.color)
                return message.channel.send({
                        embeds: [embed]
                });
            }

            const embed = new discord.EmbedBuilder()
                .setTitle("Command Details:")
                .setThumbnail('https://hzmi.xyz/assets/images/question_mark.png')
                .addFields({ name: "Command:", value: command.name ? `\`${command.name}\`` : "No name for this command.", inline: true })
                .addFields({ name: "Usage:", value: command.usage ? `\`${command.usage}\`` : `\`${config.prefix}${command.name}\``, inline: true })
                .addFields({ name: 'Aliases', value: `\`${command.aliases.length ? command.aliases.join(" | ") : "none."}\``, inline: true })
                .addFields({ name: "Command Description:", value: command.description ? command.description : "No description for this command.", inline: true })
                .setFooter({ text: `Requested by ${message.author.username} | Today at ${timezone.tz("Asia/Jakarta").format("HH:mma") + " "}`, iconURL: message.author.displayAvatarURL({
                        dynamic: true
                    })
                })
                .setColor(config.color);
            return message.channel.send({
                    embeds: [embed]
            });
        }

    }
};
