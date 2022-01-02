const discord = require('discord.js');
const config = require('../../config.json');

module.exports = {

    name: "prefix",
    aliases: [],
    description: "Set bot's change prefix",
    category: "Util",
    cooldown: 5,
    run: async (client, message, args) => {

        if (!message.guild.me.permissions.has("EMBED_LINKS")) return message.channel.send({
            content: "I do not have the **MESSAGE_EMBED_LINKS** permission in this channel.\nPlease enable it."
        });

        const embedmissingperms = new discord.MessageEmbed()
            .setDescription(`⚠ | ${message.author.username}, Missing Permission **MANAGE_GUILD**!`)
            .setColor("RED");

        const embedmissing = new discord.MessageEmbed()
            .setDescription(`⚠ | Please type the prefix you want to set!`)
            .setColor("RED");

        const embedtoolong = new discord.MessageEmbed()
            .setDescription(`❌ | Prefix's length shouldn't be longer than 5 letters`)
            .setColor("RED");

        const embedsame = new discord.MessageEmbed()
            .setDescription(`⚠ Prefix is same to current's`)
            .setColor("RED");

        if (!message.member.permissions.has("MANAGE_GUILD")) return message.channel.send({ embeds: [embedmissingperms] });

        await client.settings.ensure(message.guild.id, { prefix: config.prefix });
        if (!args[0]) return message.channel.send({ embeds: [embedmissing] });
        if (args[0].length > 5) return message.channel.send({ embeds: [embedtoolong] });
        if (args[0] == client.settings.get(message.guild.id, "prefix"))
            return message.channel.send({ embeds: [embedsame] });

        if (args[0] === "reset") {
            client.settings.delete(message.guildId, "prefix")
            const embed = new discord.MessageEmbed()
                .setDescription(`Prefix reset to Default : \`${config.prefix}\``)
                .setColor(config.color)
            return message.channel.send({ embeds: [embed] });
        }

        client.settings.set(message.guildId, args[0], "prefix");
        const embed = new discord.MessageEmbed()
            .setDescription(`Prefix Changed to : \`${args[0]}\``)
            .setColor(config.color)
        message.channel.send({ embeds: [embed] });

    }
}