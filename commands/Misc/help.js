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

        if (!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });

        if (!args[0]) {

            const categories = readdirSync(`./commands/`)

            const emo = {
                Misc: "❓ ・ ",
                Util: "⚙ ・ ",
                Owner: "👑 ・ ",
            };
    
            const embed = new discord.MessageEmbed()
                .setAuthor({ name: `❯ ・ Commands list - ${client.commands.size} Commands`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setColor(config.color)
                .setFooter({ text: `Requested by ${message.author.username} | Today at ${timezone.tz("Asia/Jakarta").format("HH:mma") + " "}`, iconURL: message.author.displayAvatarURL({ 
                        dynamic: true 
                    }) 
                })
    
            for (const category of categories) {
                const commands = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``).join(", ", "\n");
                embed.fields.push({
                    name: `${emo[category]} ${(category)} Commands`,
                    value: `> ${commands}`,
                    inline: false
                });
            }
    
            return message.channel.send({
                embeds: [embed]
            });


        } else {
            const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));

            if (!command) {
                const embed = new discord.MessageEmbed()
                        .setDescription(`Invalid command! Use \`${config.prefix}help\` for all of my commands!`)
                        .setColor(config.color)
                return message.channel.send({
                        embeds: [embed]
                });
            }

            const embed = new discord.MessageEmbed()
                .setTitle("Command Details:")
                .setThumbnail('https://hzmi.xyz/assets/images/question_mark.png')
                .addField("Command:", command.name ? `\`${command.name}\`` : "No name for this command.", true)
                .addField("Usage:", command.usage ? `\`${command.usage}\`` : `\`${config.prefix}${command.name}\``, true)
                .addField('Aliases', `\`${command.aliases.length ? command.aliases.join(" | ") : "none."}\``, true)
                .addField("Command Description:", command.description ? command.description : "No description for this command.", true)
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
